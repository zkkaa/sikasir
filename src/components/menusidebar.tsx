export default function MenSid(props: {icon: React.ReactNode; title: string;} ) {
    return (
      <li className="flex justify-start items-center gap-4 p-3 cursor-pointer rounded-md">
        {props.icon}
        <span>{props.title}</span>
      </li>
    );
  }