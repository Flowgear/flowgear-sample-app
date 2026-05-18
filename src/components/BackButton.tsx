import { useNavigate } from "react-router-dom";

export default function BackButton(props: React.ComponentProps<"button">) {
  const navigate = useNavigate();

  const handleBack = () => {
    const canGoBack = (window.history.state?.idx ?? 0) > 0;
    if (canGoBack) {
      navigate(-1);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <button
      {...props}
      className="basic-button icon-button"
      onClick={handleBack}
      aria-label="Go back"
      title="Back"
    >
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M8.95 2.45a.75.75 0 0 1 0 1.06L5.81 6.65H14a.75.75 0 0 1 0 1.5H5.81l3.14 3.14a.75.75 0 1 1-1.06 1.06L3.47 7.93a.75.75 0 0 1 0-1.06L7.89 2.45a.75.75 0 0 1 1.06 0Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
