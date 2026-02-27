import FormLayout from '../components/FormLayout';
import SettingsForm from '../components/Settings/SettingsForm';

function SettingsPage(): React.JSX.Element {
  return (
    <main>
      <FormLayout>
        <SettingsForm />
      </FormLayout>
    </main>
  );
}

export default SettingsPage;
