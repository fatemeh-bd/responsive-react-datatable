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
      className={`skleton-class ${className}`}
    />
  );
};

export default Skeleton;
