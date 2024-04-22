import ChatAI from "@/components/Dialogs/ChatAI";
import { StartDriver } from "../providers/Driver";

export default function DynamicIsland() {
  return (
    <div className="absolute top-[2%] w-full flex justify-center gap-3">
      <ChatAI />
      <StartDriver />
    </div>
  );
}
