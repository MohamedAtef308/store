import { LuUser2 } from "react-icons/lu";
import { currentUser } from "@clerk/nextjs/server";

async function UserIcon() {
  const user = await currentUser();

  if (user?.hasImage)
    return (
      <img src={user?.imageUrl} className="h-6 w-6 bg-primary rounded-full object-cover" />
    );
  return <LuUser2 className="h-6 w-6 bg-primary rounded-full text-secondary"/>;
}

export default UserIcon;
