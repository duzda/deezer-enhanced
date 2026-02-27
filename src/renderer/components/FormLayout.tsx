type FlexLayoutProps = {
  children: React.ReactNode;
};

function FormLayout({ children }: FlexLayoutProps): React.JSX.Element {
  return (
    <div className="flex flex-row">
      <div className="min-w-96 w-4/5 mx-auto my-8 flex flex-col gap-8 bg-base-200 p-8 rounded-md border-2 border-neutral">
        {children}
      </div>
    </div>
  );
}

export default FormLayout;
