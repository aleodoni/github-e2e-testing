import { Button } from "@repo/ui/button";

export default function Page(): JSX.Element {
  return (
    <>
      <h1>Hello</h1>
      <Button className="flex items-center gap-2 rounded bg-purple-800 text-white px-4 py-2" appName="1">Button</Button>
    </>
  );
}
