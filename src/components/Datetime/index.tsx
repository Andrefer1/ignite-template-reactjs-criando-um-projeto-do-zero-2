import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface DatetimeProps {
  datetime: string | null;
  hour?: boolean;
}

export default function Datetime({
  datetime,
  hour = true,
}: DatetimeProps): JSX.Element {
  const formatting = hour ? 'dd MMM yyyy' : "dd MMM yyyy 'às' HH:mm";

  return (
    <time>
      {format(new Date(datetime), formatting, {
        locale: ptBR,
      })}
    </time>
  );
}
