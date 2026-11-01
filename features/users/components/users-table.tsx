import { Badge, Button, Table, TBody, TD, TH, THead, TR } from "@/components/ui";
import { ROLE_LABEL, type Profile } from "@/lib/auth";
import { setActive, updateRole } from "../actions";
import { ROLES } from "../schema";

const selectClass = "h-8 rounded-sm border border-line bg-bg-3 px-2 text-sm text-white focus:border-green focus:outline-none";

export function UsersTable({ users, me, canManage }: { users: Profile[]; me: Profile; canManage: boolean }) {
  return (
    <Table>
      <THead>
        <tr>
          <TH>Name</TH>
          <TH>Email</TH>
          <TH>Role</TH>
          <TH>Status</TH>
          {canManage ? <TH className="text-right">Actions</TH> : null}
        </tr>
      </THead>
      <TBody>
        {users.map((u) => {
          const isMe = u.id === me.id;
          return (
            <TR key={u.id} className={!u.is_active ? "opacity-60" : undefined}>
              <TD className="text-white">
                {u.full_name || <span className="text-muted">No name yet</span>}
                {isMe ? <span className="ml-2 text-xs text-muted">(you)</span> : null}
              </TD>
              <TD>{u.email}</TD>
              <TD>
                {canManage && !isMe ? (
                  <form action={updateRole} className="inline">
                    <input type="hidden" name="id" value={u.id} />
                    <select name="role" defaultValue={u.role} className={selectClass}>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>{" "}
                    <Button type="submit" variant="ghost" size="sm">
                      Apply
                    </Button>
                  </form>
                ) : (
                  <Badge tone={u.role === "owner" ? "green" : "neutral"}>{ROLE_LABEL[u.role]}</Badge>
                )}
              </TD>
              <TD>{u.is_active ? <Badge tone="green">Active</Badge> : <Badge tone="red">Deactivated</Badge>}</TD>
              {canManage ? (
                <TD className="text-right">
                  {!isMe ? (
                    <form action={setActive} className="inline">
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="is_active" value={u.is_active ? "false" : "true"} />
                      <Button type="submit" variant={u.is_active ? "danger" : "secondary"} size="sm">
                        {u.is_active ? "Deactivate" : "Reactivate"}
                      </Button>
                    </form>
                  ) : null}
                </TD>
              ) : null}
            </TR>
          );
        })}
      </TBody>
    </Table>
  );
}
