import { warningMessages } from '../../common/types/deemix';

type LogDisplayProps = {
  code: string;
};

const getLineColor = (line: string): string => {
  if (line.startsWith('[')) {
    if (warningMessages.some((m) => line.endsWith(m))) {
      return 'text-warning';
    }

    return '';
  }

  if (line === 'All done!') {
    return 'text-success';
  }

  return 'text-error';
};

function LogDisplay({ code }: LogDisplayProps): React.JSX.Element {
  return (
    <div className="mockup-code">
      {code
        .split('\n')
        .slice(0, -1)
        .map((line, i) => (
          <pre
            // eslint-disable-next-line react/no-array-index-key
            key={`${i}-${line}`}
            data-prefix={i + 1}
            className={getLineColor(line)}
          >
            <code>{line}</code>
          </pre>
        ))}
    </div>
  );
}

export default LogDisplay;
