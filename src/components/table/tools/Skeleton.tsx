const Skeleton = ({
  height = "30px",
  style = {},
  className,
}: {
  height?: string;
  style?: Object;
  className?: string;
}) => {
  return (
    <div
      style={{ height, ...style }}
      className={`my-2 w-full animate-pulse bg-gray-200 skleton-class ${className}`}
    />
  );
};

export default Skeleton;
