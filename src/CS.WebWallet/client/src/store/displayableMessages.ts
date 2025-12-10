import {
  createStore,
  combine,
  createEffect,
  sample,
  createEvent,
} from "effector";
import { pending } from "patronum";
import DisplayableMessagesService, {
  DisplayableMessageRow,
  DisplayableMessagesProps,
  TagsFilter,
} from "@services/DisplayableMessagesService";
import { $translation } from "./translation";

const getMessageTags = createEvent<TagsFilter[]>();

const getMessagesFx = createEffect(() => {
  return DisplayableMessagesService.all({ iso6391: "en" });
});

const getTagsFx = createEffect((props: DisplayableMessagesProps) => {
  return DisplayableMessagesService.all(props);
});

const $msg = createStore<DisplayableMessageRow[] | null>(null)
  .on(getMessagesFx.doneData, (_, payload) => payload.data)
  .on(getMessagesFx.failData, () => []);

const $isLoading = pending({ effects: [getMessagesFx] });

const $tags = createStore<DisplayableMessageRow[]>([])
  .on(getTagsFx.doneData, (_, e) => e.data ?? [])
  .reset(getTagsFx.fail);

sample({
  clock: getMessageTags,
  source: { lang: $translation },
  fn: ({ lang }, tags) => ({ iso6391: lang.currentLanguage, tags }),
  target: getTagsFx,
});

const $messages = combine({
  messages: $msg,
  tags: $tags,
  isLoadingMessage: $isLoading,
});

export { $messages, getMessagesFx, getMessageTags };
