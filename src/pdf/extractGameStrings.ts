const daytimePattern = /^\d{2}:\d{2}:\d{2}/;

export const extractGameStrings = (
  pdfText: string,
): { metadataStrings: string[]; teamDataStrings: string[]; gameEventStrings: string[] } => {
  const lines = pdfText.split('\n');

  const metadataStartIndex = lines.findIndex((line) => line.includes('Übersicht Spieldaten'));
  const metadataEndIndex = lines.findIndex((line) => line.includes('Schiedsrichter'));
  const metadataStrings = lines.slice(metadataStartIndex + 1, metadataEndIndex);

  const teamDataStartIndex = lines.findIndex((line) => line.includes('Mannschaftslisten'));
  const teamDataEndIndex = lines.findIndex((line) =>
    line.includes('ZeitSpielzeitSpielstandAktion'),
  );
  const teamDataStrings = lines.slice(teamDataStartIndex + 1, teamDataEndIndex - 1);
  const gameEventStrings = lines.slice(teamDataEndIndex + 1, lines.length);

  return {
    metadataStrings,
    teamDataStrings,
    gameEventStrings: gameEventStrings.filter((line) => line.match(daytimePattern)),
  };
};
