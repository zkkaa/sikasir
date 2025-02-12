export default function HeadPage(props: {icon: React.ReactNode; title: string; deskrip: string;}) {
    return (
        <div className="flex gap-4 items-center">
        <div className="bg-blue-400 w-12 h-12 flex justify-center items-center rounded-lg shadow-md">
            
            {props.icon}
        </div>
        <div>
            <h1 className="font-semibold text-2xl">{props.title}</h1>
            <span className="text-sm">{props.deskrip}</span>
        </div>
    </div>
    );
  }