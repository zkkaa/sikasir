export default function TitlePage(props: {className?: string; title: string;}) {
    return (
        <header>
            <div className={`bg-blue-300 w-[70px] h-1 ${props.className} `}></div>
            <h1 className="text-xl font-semibold leading-none tracking-tight mt-2 mb-6">{props.title}</h1>
        </header>
    );
  }