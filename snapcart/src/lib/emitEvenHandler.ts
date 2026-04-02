import axios from "axios";

const emitEvenHandler = async (event: string, data: any, sockedId?: string) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, {
      event,
      data,
      sockedId
    });
  } catch (error) {
    console.log(error);
  }
};

export default emitEvenHandler;
