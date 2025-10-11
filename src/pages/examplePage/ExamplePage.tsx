import { Link } from "react-router-dom";
import table1 from "./images/table1.png";
import table2 from "./images/table2.png";
import table3 from "./images/table3.png";

const ExamplePage = () => {
  return (
    <div className="flex flex-wrap gap-4 mx-auto overflow-auto py-8">
      <div>
        <h4 className="md:text-3xl text-lg font-bold text-white my-2">Basic</h4>
        <Link
          to="/example/basic"
          className="rounded-2xl shadow-xl shadow-[#15234d90] overflow-hidden w-[600px] h-[500px] block"
        >
          <img src={table1} alt="image" className="size-full object-fill" />
        </Link>
      </div>
      <div>
        <h4 className="md:text-3xl text-lg font-bold text-white my-2">
          Static Auto PageSize
        </h4>
        <Link
          to="/example/staticAutoPageSize"
          className="rounded-2xl shadow-xl shadow-[#15234d90] overflow-hidden w-[600px] h-[500px] block"
        >
          <img src={table2} alt="image" className="size-full object-fill" />
        </Link>
      </div>
      <div>
        <h4 className="md:text-3xl text-lg font-bold text-white my-2">
          External Api
        </h4>
        <Link
          to="/example/external"
          className="rounded-2xl shadow-xl shadow-[#15234d90] overflow-hidden w-[600px] h-[500px] block"
        >
          <img src={table3} alt="image" className="size-full object-fill" />
        </Link>
      </div>
    </div>
  );
};

export default ExamplePage;
