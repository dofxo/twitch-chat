import Chat from "./Chat";

const Chats = () => {
  return (
    <section>
      <div className="container flex flex-col gap-[10px]">
        <Chat />
        <Chat />
        <Chat />
      </div>
    </section>
  );
};

export default Chats;
