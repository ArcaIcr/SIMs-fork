interface ManagerNavbarProps {
  user?: {
    displayName?: string;
    role?: string;
    shift?: string;
    branchName?: string;
  } | null;
}

const ManagerNavbar: React.FC<ManagerNavbarProps> = ({ user }) => (
  <div className="flex items-center justify-between px-8 py-4 bg-[#FFF7E6] border-b-2 border-[#E2C089] shadow-md">
    <div className="flex items-center gap-4">
      <img src="/logo.png" alt="Minute Burger" className="w-14 h-14 rounded-full bg-white border" />
      <div>
        <div className="font-bold text-lg text-[#B77B2B]">Hello, {user?.displayName || 'Manager'}!</div>
        <div className="text-xs text-[#8B6F3A]">SIMS {user?.role || 'Manager'} | Shift: {user?.shift || 'N/A'}</div>
        <div className="text-xs text-[#8B6F3A]">{user?.branchName ? `Branch: ${user.branchName}` : 'Branch'}</div>
      </div>
    </div>
    <div className="flex gap-4">
      <button className="bg-white rounded-full shadow p-3"><i className="fa fa-bell text-[#B77B2B]"></i></button>
      <button className="bg-white rounded-full shadow p-3"><i className="fa fa-user text-[#B77B2B]"></i></button>
    </div>
  </div>
);

export default ManagerNavbar;
