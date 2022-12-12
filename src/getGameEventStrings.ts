const daytimePattern = /^\d{2}:\d{2}:\d{2}/;

export const getMachStrings = (
  pdfText: string,
): { metadataStrings: string[]; gameEventStrings: string[] } => {
  const lines = pdfText.split('\n');

  const metadataStartIndex = lines.findIndex((line) => line.includes('Übersicht Spieldaten'));
  const metadataEndIndex = lines.findIndex((line) => line.includes('Schiedsrichter'));
  const metadataStrings = lines.slice(metadataStartIndex + 1, metadataEndIndex);

  const index = lines.findIndex((line) => line.includes('ZeitSpielzeitSpielstandAktion'));
  const gameEventStrings = lines.slice(index + 1, lines.length);

  return {
    metadataStrings,
    gameEventStrings: gameEventStrings.filter((line) => line.match(daytimePattern)),
  };
};
