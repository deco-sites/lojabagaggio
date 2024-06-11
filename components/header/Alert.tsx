import Icon from "../ui/Icon.tsx";

export interface Alert {
  link?: string;
  label: string;
}

export interface Props {
  alerts?: Alert[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function Alert({ alerts = [] }: Props) {
  return (
    <div class="bg-secondary">
      <div class="flex items-center gap-12 container">
        <div class="flex items-center justify-between gap-1">
          <Icon id="pin" size={20} strokeWidth={16} />
          <span class="text-[13px] text-base-300 flex justify-center items-center h-[38px]">
            22471-003
          </span>
        </div>
        <span class="hidden sm:block w-[1px] h-[25px] bg-base-300">
        </span>
        {alerts.map((alert) => (
          <a
            href={alert.link}
            class="hidden sm:flex text-[13px] text-base-300 justify-center items-center h-[38px]"
          >
            {alert.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Alert;
