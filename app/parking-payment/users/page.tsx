'use server'
// import { getUsersAction } from "@/actions/users";
import { parse } from "url";
import UsersClient from "./UsersClient";
import User, { Rol } from "@/types/User";
import { getUsersAction, getRolesAction } from "@/actions/users";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const { users, existingUserEmails, existingUsernames } = await getUsersAction();
  // const users: User[] = [];
  const roles: Rol[] = await getRolesAction();

  return <UsersClient users={users} roles={roles} existingUserEmails={existingUserEmails} existingUsernames={existingUsernames} />;
}
