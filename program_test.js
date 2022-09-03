
	const chai = require("chai");
	const resnap = require("resnap")();
	function sum(a,b){
  return a+b;
}describe('Penjumlaha Test',()=>{
  it('Should return 7',()=>{
    chai.expect(sum(5,2)).to.eql(7)
  })
})