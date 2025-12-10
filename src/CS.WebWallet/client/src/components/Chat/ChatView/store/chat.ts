import { createEffect, createEvent, createStore } from "effector";
import ChatService, { Message } from "@services/chats/ChatService";

type ChatStore = {
  messages: Message[];
  isLoading: boolean;
};

const defaultValues = {
  messages: [],
  isLoading: false,
};

export const getMessagesFx = createEffect(async () => {
  const res = await ChatService.messages({
    pageIndex: 1,
    pageSize: 10,
  });
  return res.data.reverse();
});

export const $messageReceived = createEvent<Message>();
export const $messageRemoved = createEvent<string>();
export const $messageUpdated = createEvent<Message>();

export const $chatStore = createStore<ChatStore>(defaultValues)
  .on(getMessagesFx.pending, (prev, state) => ({ ...prev, isLoading: state }))
  .on(getMessagesFx.doneData, (prev, state) => {
    return {
      ...prev,
      isLoading: false,
      messages: state,
    };
  })
  .on($messageRemoved, (prev, payload) => ({
    ...prev,
    messages: prev.messages.filter((f) => f.id !== payload),
  }))
  .on($messageReceived, (prev, state) => ({
    ...prev,
    messages: [...prev.messages, state],
  }))
  .on($messageUpdated, (prev, payload) => ({
    ...prev,
    messages: prev.messages.reduce((r: Message[], c: Message) => {
      if (c.id === payload.id) {
        c.message = payload.message;
      }
      r.push(c);
      return r;
    }, []),
  }));
