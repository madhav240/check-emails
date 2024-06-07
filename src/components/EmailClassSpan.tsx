export default function EmailClassSpan({ classification }) {
  const colors = {
    important: "red",
    general: "black",
    spam: "gray",
    marketing: "blue",
    promotion: "green",
    social: "orange",
  };

  return (
    <span
      className="text-xs text-white h-fit px-1 py-0.5  rounded-sm font-medium"
      style={{ backgroundColor: colors[classification] }}
    >
      {classification}
    </span>
  );
}
