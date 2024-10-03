interface Props {
  placeHolder: string;
  type: string;
  onChange: (ev: any) => void;
}
const Input = ({ placeHolder, type, onChange }: Props) => {
  return (
    <input
      className="common-input"
      type={type}
      placeholder={placeHolder}
      onChange={onChange}
    ></input>
  );
};
export default Input;
