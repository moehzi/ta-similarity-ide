
	const chai = require("chai");
	const resnap = require("resnap")();
	describe('test', () => {
  it('Should return 6', () => {
    chai.expect(sum(4, 2)).to.eql(6);
    });

    it('Should return 7',()=>{
    chai.expect(sum(5,2)).to.eql(7);
    });
});function sum(a,b){
  return a+b;
}