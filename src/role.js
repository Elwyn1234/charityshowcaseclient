export { userRole, Role, stringToRole, roleToString }

const userRole = () => stringToRole(document.cookie.match(/role=(.*),*/)?.at(1))

const Role = {
  User: 1,
  Editor: 2,
  Creator: 3,
  Admin: 4,
}
function stringToRole(string) {
  if (!string) return
  switch(string.toLowerCase()) {
    case "user": return Role.User;
    case "editor": return Role.Editor;
    case "creator": return Role.Creator;
    case "admin": return Role.Admin;
  }
}
function roleToString(role) {
  if (!role) return
  switch(role) {
    case Role.User: return "user";
    case Role.Editor: return "editor";
    case Role.Creator: return "creator";
    case Role.Admin: return "admin";
  }
}

