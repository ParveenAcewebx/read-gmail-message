module.exports = {
  // Reff: https://www.codegrepper.com/code-examples/javascript/javascript+get+first+property+of+object
  getObjFirstValue(obj) {
    if (typeof obj == "object") {
      return obj[Object.keys(obj)[0]];
    } else {
      return false;
    }
  },
  // Reff: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  customizeCatchMsg(errorMsg) {
    return `${errorMsg.name} : ${errorMsg.message} ${errorMsg.stack}`;
  },
  parseErrorRespose(errorMsg) {
    var returnData = {};
    returnData.status = false;
    returnData.message = this.getObjFirstValue(errorMsg);
    returnData.data = { errors: errorMsg };
    return returnData;
  },
  parseSuccessRespose(data = "", successMsg = "") {
    var returnData = {};
    returnData.status = true;
    returnData.message = successMsg;
    if (typeof data == "string") {
      returnData.data = {};
    } else {
      returnData.data = data;
    }
    return returnData;
  },
  isKeyValueExist(obj, key, val, returnKey) {
    obj.some(function (o) {
      if (o[key] === val) {
        console.log("ddddddd", o[returnKey]);
        return true;
      }
      return false;
    });
  },
  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },

  async sleep(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  },
};
