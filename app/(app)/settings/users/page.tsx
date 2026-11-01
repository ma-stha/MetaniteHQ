import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { listProfiles } from "@/features/users/queries";
import { UsersTable } from "@/features/users/components/users-table";
import { InviteForm } from "@/features/users/components/invite-form";
import { ProfileForm } from "@/features/users/components/profile-form";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireUser();
  const users = await listProfiles();
  const canManage = me.role === "owner";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
        </CardHeader>
        <CardBody>
          <ProfileForm fullName={me.full_name} />
        </CardBody>
      </Card>

      {canManage ? (
        <Card>
          <CardHeader>
            <CardTitle>Invite someone</CardTitle>
          </CardHeader>
          <CardBody>
            <InviteForm />
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <span className="text-xs text-muted">
            Owner: everything. Consultant: assigned clients. Viewer: read only.
          </span>
        </CardHeader>
        <CardBody className="p-0">
          <UsersTable users={users} me={me} canManage={canManage} />
        </CardBody>
      </Card>
    </div>
  );
}
