import { getItem, setItem, removeItem } from './asyncStorage';

export const testAsyncStorage = async () => {
  console.log('🧪 Testing AsyncStorage functionality...');
  
  try {
    // Test 1: Set and get a simple value
    console.log('Test 1: Setting and getting a simple value');
    const testKey = 'test_key';
    const testValue = 'test_value';
    
    const setResult = await setItem(testKey, testValue);
    console.log('Set result:', setResult);
    
    const getResult = await getItem(testKey);
    console.log('Get result:', getResult);
    console.log('Test 1 passed:', getResult === testValue);
    
    // Test 2: Test with null/undefined
    console.log('Test 2: Testing with null value');
    const nullResult = await getItem('non_existent_key');
    console.log('Null result:', nullResult);
    console.log('Test 2 passed:', nullResult === null);
    
    // Test 3: Test token storage
    console.log('Test 3: Testing token storage');
    const tokenValue = 'test_token_12345';
    const tokenSetResult = await setItem('token', tokenValue);
    console.log('Token set result:', tokenSetResult);
    
    const tokenGetResult = await getItem('token');
    console.log('Token get result:', tokenGetResult);
    console.log('Test 3 passed:', tokenGetResult === tokenValue);
    
    // Clean up
    await removeItem(testKey);
    console.log('🧪 AsyncStorage tests completed successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ AsyncStorage test failed:', error);
    return false;
  }
}; 