const RenderCurrentTemplate = ({ currentTemplate, templateConfig }) => {
  return Object.values(currentTemplate).map((Template, index) => (
    <Template key={`${index}`} templateData={templateConfig} />
  ));
};

export default RenderCurrentTemplate;
