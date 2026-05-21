import { useNavigate } from "react-router-dom";

type Props = {
  readonly label: string;
  readonly to: string;
  readonly isActive: boolean;
};

export default function RouteButton(props: Props) {
  const navigate = useNavigate();

  return (
    <button
      className={`basic-button ${props.isActive ? "basic-button-primary" : ""}`}
      onClick={() => navigate(props.to)}
    >
      {props.label}
    </button>
  );
}
