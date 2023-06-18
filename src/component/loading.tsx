import ReactLoading from "react-loading";

type Props = {
  height: number;
  width: number;
};

export const Loading = ({ height, width }: Props) => {
  return (
    <div className="flex max-h-full w-full items-center justify-center">
      <ReactLoading type="bubbles" color="#ffffff" />
    </div>
  );
};
