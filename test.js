const trian = require('./src/services/trian');

const cppCode = `
void test(int n){
  for(int i=0;i<n;i++){
    int x = n;
    while(x > 1){
      x /= 2;
    }
  }
}
`;

console.log(trian.analyzeCPP(cppCode));

