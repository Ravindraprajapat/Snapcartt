import mongoose from "mongoose";

export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  text: string;
  senderId: mongoose.Types.ObjectId;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
    text: {
      type: String,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    time: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;