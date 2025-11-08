
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MediaBrowser from '@/components/MediaBrowser'

export default function Index() {


  return (
    <SafeAreaView className='flex-1'>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 8, paddingTop: 0 }}>

        <MediaBrowser />
      </ScrollView>
    </SafeAreaView>
  );
}

