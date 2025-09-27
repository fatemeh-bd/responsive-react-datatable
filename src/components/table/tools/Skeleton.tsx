const Skeleton = ({
  height = "h-9",
  style = {},
  className,
}: {
  height?: string;
  style?: Object;
  className?: string;
}) => {
  return (
    <div
      style={style}
      className={`${height} my-2 w-full animate-pulse bg-gray-200 dark:bg-gray-800 ${className}`}
    />
  );
};

export default Skeleton;
