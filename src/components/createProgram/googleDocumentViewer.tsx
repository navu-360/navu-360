export const GoogleDocumentViewer = ({ link }: { link: string }) => {
  const documentURL = link;
  return (
    <div className="h-full w-full">
      <iframe src={documentURL} width="100%" className="h-full" />
    </div>
  );
};
