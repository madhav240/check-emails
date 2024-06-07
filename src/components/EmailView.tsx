import Link from "next/link";
import EmailClassSpan from "./EmailClassSpan";

export default function EmailView({ data }) {
  const fromStr = data.from;

  return (
    <>
      <div className="fixed h-[90vh]  w-full top-16 mt-1 bg-white  lg:top-0 lg:right-0 lg:h-screen lg:w-[50vw] lg:px-4 lg:border-l">
        <Link
          href={"?"}
          className="w-fit absolute z-10 flex flex-row justify-center bg-white items-center px-4 right-0 left-0 mx-auto  mt-1 border "
        >
          EXIT
        </Link>
        <div className="overflow-y-auto h-full px-2">
          <div className="relative pt-4 w-full mt-8">
            <div>
              <h1 className="font-semibold w-[90%]">{data.subject}</h1>
              <h2 className="line-clamp-1 text-sm font-light">
                {fromStr.substring(
                  fromStr.indexOf("<") + 1,
                  fromStr.lastIndexOf(">")
                )}
              </h2>
              <EmailClassSpan classification={data.classification} />
            </div>
          </div>
          <p>{data.message}</p>
        </div>
      </div>
    </>
  );
}
