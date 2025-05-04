export type TButtonProps = {
  /** вид кнопки */
  variant?: "primary" | "outline" | "ghost";
  /** отключена? */
  disabled?: boolean;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
