import { DeleteAPI } from '../src/api';

async function testAPI() {
  try {
    const result = await DeleteAPI.delete(['*.tmp'], {
      recursive: true,
      log: true
    });
    console.log('Delete API test result:', result);
  } catch (error) {
    console.error('Delete API test failed:', error);
  }
}

testAPI();
