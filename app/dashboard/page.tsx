import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {

    const session = await getSession();

    if(!session?.user)
        redirect("/account/sign-in");

    return <div>Dashboard page</div>;
}