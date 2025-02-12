export default function Card(props: {iconc: string; textc: string; title: string; total: string; icon: React.ReactNode;}) {
    return <div className="w-full col-span-1 bg-white p-2 sm:p-4 flex gap-4 items-center rounded-lg shadow-md shadow-gray-300">
        <div className={`p-2 md:p-3 ${props.iconc} text-2xl md:text-3xl rounded-lg`}>
            {props.icon}
        </div>
        <div className="flex flex-col">
            <span className="text-xs text-gray-500">{props.title}</span>
            <span className={`text-xl font-semibold ${props.textc} `}>{props.total}</span>
        </div>
    </div>
}