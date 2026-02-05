import { auth } from "@/auth";
import AdminDashBoard from "@/components/AdminDashBoard";
import DeliveryBoy from "@/components/DeliveryBoy";
import EditRoleMobile from "@/components/EditRoleMobile";
import Nav from "@/components/Nav";
import UserDashBoard from "@/components/UserDashBoard";
import connectDb from "@/lib/db";
import User from "@/models/userModel";
import { redirect } from "next/navigation";

async function Home() {
  await connectDb();
  const session = await auth();

  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }
  const InComplete =
    !user.mobile || !user.role || (!user.mobile && user.role == "user");
  if (InComplete) {
    return <EditRoleMobile />;
  }
  const plainUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Nav user={plainUser} />
      {user.role == "user" ? (
        <UserDashBoard/>
      ) : user.role == "admin" ? (
        <AdminDashBoard />
      ) : (
        <DeliveryBoy />
      )}
    </>
  );
}

export default Home;
