export const GoogleDocumentViewer = ({ link }: { link: string }) => {
  const documentURL = link;
  return (
    <div className="w-full">
      <iframe src={documentURL} width="100%" height="600px" />
    </div>
  );
};
