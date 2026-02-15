import { useAtomValue } from 'jotai';
import { ExecStatus } from 'src/common/types/deemix';
import LogDisplay from '../components/LogDisplay';
import { currentLogAtom } from '../states/atoms';

const getStatusColor = (status: ExecStatus): string => {
  switch (status) {
    case 'Error':
      return 'text-error';
    case 'Warning':
      return 'text-warning';
    case 'Success':
      return 'text-success';
    default:
      throw Error(`Unexpected exec status ${status satisfies never}.`);
  }
};

const getContents = (
  stdout: string,
  stderr: string
): React.JSX.Element | null => {
  if (stdout === '' && stderr === '') {
    return null;
  }

  if (stdout === '') {
    return <LogDisplay code={stderr} />;
  }

  if (stderr === '') {
    return <LogDisplay code={stdout} />;
  }

  return (
    <>
      <LogDisplay code={stdout} />
      <div className="divider divider-horizontal" />
      <LogDisplay code={stderr} />
    </>
  );
};

function LogPage(): React.JSX.Element {
  const currentLog = useAtomValue(currentLogAtom);

  return (
    <div className="mx-8">
      <p className="text-xl text-center mb-8">
        Log for {currentLog.display} ended with{' '}
        <span className={getStatusColor(currentLog.status)}>
          {currentLog.status.toLowerCase()}
        </span>
        .
      </p>
      <main className="flex flex-row justify-center">
        {getContents(currentLog.stdout, currentLog.stderr)}
      </main>
    </div>
  );
}

export default LogPage;
