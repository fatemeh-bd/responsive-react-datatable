const Skeleton = ({
  height = "h-9",
  style = {},
}: {
  height?: string;
  style?: Object;
}) => {
  return (
    <div
      style={style}
      className={`${height} my-2 w-full animate-pulse bg-gray-200 dark:bg-gray-800`}
    />
  );
};

export default Skeleton;
