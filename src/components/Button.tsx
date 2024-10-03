interface Props {
  onClick: () => void;
  text: string;
}
const Button = ({ text, onClick }: Props) => {
  return (
    <button className="common-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
