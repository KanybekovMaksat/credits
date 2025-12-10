import { combine, createEvent, createStore } from "effector";

export interface ModalProps {
  title?: string;
  body?: string;
}

export const showModal = createEvent<ModalProps>();
export const closeModal = createEvent();

const $title = createStore<string | null>(null);
$title.on(showModal, (_, payload) => payload.title).on(closeModal, () => null);
const $body = createStore<string | null>(null);
$body.on(showModal, (_, payload) => payload.body).on(closeModal, () => null);

const $visible = createStore<boolean>(false);
$visible.on(showModal, () => true).on(closeModal, () => false);

export const $modalStore = combine({
  visible: $visible,
  title: $title,
  body: $body,
});
