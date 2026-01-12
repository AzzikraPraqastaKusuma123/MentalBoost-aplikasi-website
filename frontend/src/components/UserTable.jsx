
export default function UserTable({ users }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Normal': return 'bg-green-100 text-green-700';
            case 'Ringan': return 'bg-blue-100 text-blue-700';
            case 'Sedang': return 'bg-yellow-100 text-yellow-700';
            case 'Parah': return 'bg-orange-100 text-orange-700';
            case 'Sangat Parah': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Data Pasien / Pengguna</h3>
                <span className="text-xs font-semibold px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full">
                    {users.length} Total Users
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nama Lengkap</th>
                            <th className="px-6 py-4">Tanggal Gabung</th>
                            <th className="px-6 py-4">Asesmen Terakhir</th>
                            <th className="px-6 py-4">Status Mental (Terakhir)</th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold mr-3 text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.joined_at}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {user.last_assessment}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>

                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-sm">
                                    Belum ada data pengguna.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
