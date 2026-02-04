// Temporary debugging utility - paste this in browser console to check auth state

console.log('=== Auth Debug Info ===');
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
console.log('Token type:', typeof localStorage.getItem('token'));
console.log('Token value is "undefined"?', localStorage.getItem('token') === 'undefined');
console.log('Token value is "null"?', localStorage.getItem('token') === 'null');

// Clear invalid tokens
if (!localStorage.getItem('token') || 
    localStorage.getItem('token') === 'undefined' || 
    localStorage.getItem('token') === 'null') {
    console.log('❌ Invalid token detected - clearing...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Cleared. Please log in again.');
} else {
    console.log('✅ Token looks valid');
}
