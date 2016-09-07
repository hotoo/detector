/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict';
	
	var base64 = __webpack_require__(7);
	var ieee754 = __webpack_require__(8);
	var isArray = __webpack_require__(9);
	
	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;
	Buffer.poolSize = 8192; // not used by this implementation
	
	var rootParent = {};
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
	
	function typedArraySupport() {
	  function Bar() {}
	  try {
	    var arr = new Uint8Array(1);
	    arr.foo = function () {
	      return 42;
	    };
	    arr.constructor = Bar;
	    return arr.foo() === 42 && // typed array instances can be augmented
	    arr.constructor === Bar && // constructor can be set
	    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	    arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	    ;
	  } catch (e) {
	    return false;
	  }
	}
	
	function kMaxLength() {
	  return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer(arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1]);
	    return new Buffer(arg);
	  }
	
	  this.length = 0;
	  this.parent = undefined;
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg);
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
	  }
	
	  // Unusual.
	  return fromObject(this, arg);
	}
	
	function fromNumber(that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0;
	    }
	  }
	  return that;
	}
	
	function fromString(that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0;
	  that = allocate(that, length);
	
	  that.write(string, encoding);
	  return that;
	}
	
	function fromObject(that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object);
	
	  if (isArray(object)) return fromArray(that, object);
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string');
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object);
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object);
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object);
	
	  return fromJsonObject(that, object);
	}
	
	function fromBuffer(that, buffer) {
	  var length = checked(buffer.length) | 0;
	  that = allocate(that, length);
	  buffer.copy(that, 0, 0, length);
	  return that;
	}
	
	function fromArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}
	
	function fromArrayBuffer(that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength;
	    that = Buffer._augment(new Uint8Array(array));
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array));
	  }
	  return that;
	}
	
	function fromArrayLike(that, array) {
	  var length = checked(array.length) | 0;
	  that = allocate(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject(that, object) {
	  var array;
	  var length = 0;
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data;
	    length = checked(array.length) | 0;
	  }
	  that = allocate(that, length);
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that;
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}
	
	function allocate(that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length));
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length;
	    that._isBuffer = true;
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
	  if (fromPool) that.parent = rootParent;
	
	  return that;
	}
	
	function checked(length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
	  }
	  return length | 0;
	}
	
	function SlowBuffer(subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);
	
	  var buf = new Buffer(subject, encoding);
	  delete buf.parent;
	  return buf;
	}
	
	Buffer.isBuffer = function isBuffer(b) {
	  return !!(b != null && b._isBuffer);
	};
	
	Buffer.compare = function compare(a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers');
	  }
	
	  if (a === b) return 0;
	
	  var x = a.length;
	  var y = b.length;
	
	  var i = 0;
	  var len = Math.min(x, y);
	  while (i < len) {
	    if (a[i] !== b[i]) break;
	
	    ++i;
	  }
	
	  if (i !== len) {
	    x = a[i];
	    y = b[i];
	  }
	
	  if (x < y) return -1;
	  if (y < x) return 1;
	  return 0;
	};
	
	Buffer.isEncoding = function isEncoding(encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true;
	    default:
	      return false;
	  }
	};
	
	Buffer.concat = function concat(list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');
	
	  if (list.length === 0) {
	    return new Buffer(0);
	  }
	
	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length;
	    }
	  }
	
	  var buf = new Buffer(length);
	  var pos = 0;
	  for (i = 0; i < list.length; i++) {
	    var item = list[i];
	    item.copy(buf, pos);
	    pos += item.length;
	  }
	  return buf;
	};
	
	function byteLength(string, encoding) {
	  if (typeof string !== 'string') string = '' + string;
	
	  var len = string.length;
	  if (len === 0) return 0;
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len;
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length;
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2;
	      case 'hex':
	        return len >>> 1;
	      case 'base64':
	        return base64ToBytes(string).length;
	      default:
	        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;
	
	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined;
	Buffer.prototype.parent = undefined;
	
	function slowToString(encoding, start, end) {
	  var loweredCase = false;
	
	  start = start | 0;
	  end = end === undefined || end === Infinity ? this.length : end | 0;
	
	  if (!encoding) encoding = 'utf8';
	  if (start < 0) start = 0;
	  if (end > this.length) end = this.length;
	  if (end <= start) return '';
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end);
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end);
	
	      case 'ascii':
	        return asciiSlice(this, start, end);
	
	      case 'binary':
	        return binarySlice(this, start, end);
	
	      case 'base64':
	        return base64Slice(this, start, end);
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end);
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString() {
	  var length = this.length | 0;
	  if (length === 0) return '';
	  if (arguments.length === 0) return utf8Slice(this, 0, length);
	  return slowToString.apply(this, arguments);
	};
	
	Buffer.prototype.equals = function equals(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return true;
	  return Buffer.compare(this, b) === 0;
	};
	
	Buffer.prototype.inspect = function inspect() {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>';
	};
	
	Buffer.prototype.compare = function compare(b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
	  if (this === b) return 0;
	  return Buffer.compare(this, b);
	};
	
	Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
	  if (byteOffset > 2147483647) byteOffset = 2147483647;else if (byteOffset < -2147483648) byteOffset = -2147483648;
	  byteOffset >>= 0;
	
	  if (this.length === 0) return -1;
	  if (byteOffset >= this.length) return -1;
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1; // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset);
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset);
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
	    }
	    return arrayIndexOf(this, [val], byteOffset);
	  }
	
	  function arrayIndexOf(arr, val, byteOffset) {
	    var foundIndex = -1;
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
	      } else {
	        foundIndex = -1;
	      }
	    }
	    return -1;
	  }
	
	  throw new TypeError('val must be string, number or Buffer');
	};
	
	// `get` is deprecated
	Buffer.prototype.get = function get(offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.');
	  return this.readUInt8(offset);
	};
	
	// `set` is deprecated
	Buffer.prototype.set = function set(v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.');
	  return this.writeUInt8(v, offset);
	};
	
	function hexWrite(buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string');
	
	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) throw new Error('Invalid hex string');
	    buf[offset + i] = parsed;
	  }
	  return i;
	}
	
	function utf8Write(buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
	}
	
	function asciiWrite(buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length);
	}
	
	function binaryWrite(buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length);
	}
	
	function base64Write(buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length);
	}
	
	function ucs2Write(buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
	}
	
	Buffer.prototype.write = function write(string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0
	    // Buffer#write(string, encoding)
	    ;
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0
	    // Buffer#write(string, offset[, length][, encoding])
	    ;
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	    // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding;
	    encoding = offset;
	    offset = length | 0;
	    length = swap;
	  }
	
	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;
	
	  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds');
	  }
	
	  if (!encoding) encoding = 'utf8';
	
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length);
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length);
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length);
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length);
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length);
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length);
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};
	
	Buffer.prototype.toJSON = function toJSON() {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  };
	};
	
	function base64Slice(buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf);
	  } else {
	    return base64.fromByteArray(buf.slice(start, end));
	  }
	}
	
	function utf8Slice(buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];
	
	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 128) {
	            codePoint = firstByte;
	          }
	          break;
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 192) === 128) {
	            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
	            if (tempCodePoint > 127) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
	            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
	            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break;
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
	            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
	            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 65533;
	      bytesPerSequence = 1;
	    } else if (codePoint > 65535) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 65536;
	      res.push(codePoint >>> 10 & 1023 | 55296);
	      codePoint = 56320 | codePoint & 1023;
	    }
	
	    res.push(codePoint);
	    i += bytesPerSequence;
	  }
	
	  return decodeCodePointsArray(res);
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 4096;
	
	function decodeCodePointsArray(codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	    ;
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
	  }
	  return res;
	}
	
	function asciiSlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 127);
	  }
	  return ret;
	}
	
	function binarySlice(buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret;
	}
	
	function hexSlice(buf, start, end) {
	  var len = buf.length;
	
	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;
	
	  var out = '';
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i]);
	  }
	  return out;
	}
	
	function utf16leSlice(buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res;
	}
	
	Buffer.prototype.slice = function slice(start, end) {
	  var len = this.length;
	  start = ~ ~start;
	  end = end === undefined ? len : ~ ~end;
	
	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }
	
	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }
	
	  if (end < start) end = start;
	
	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end));
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start];
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this;
	
	  return newBuf;
	};
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset(offset, ext, length) {
	  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);
	
	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 256)) {
	    val += this[offset + i] * mul;
	  }
	
	  return val;
	};
	
	Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }
	
	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 256)) {
	    val += this[offset + --byteLength] * mul;
	  }
	
	  return val;
	};
	
	Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset];
	};
	
	Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | this[offset + 1] << 8;
	};
	
	Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] << 8 | this[offset + 1];
	};
	
	Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
	};
	
	Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
	};
	
	Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);
	
	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 256)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 128;
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
	
	  return val;
	};
	
	Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);
	
	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 256)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 128;
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);
	
	  return val;
	};
	
	Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 128)) return this[offset];
	  return (255 - this[offset] + 1) * -1;
	};
	
	Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | this[offset + 1] << 8;
	  return val & 32768 ? val | 4294901760 : val;
	};
	
	Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | this[offset] << 8;
	  return val & 32768 ? val | 4294901760 : val;
	};
	
	Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
	};
	
	Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	
	  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
	};
	
	Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, true, 23, 4);
	};
	
	Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754.read(this, offset, false, 23, 4);
	};
	
	Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, true, 52, 8);
	};
	
	Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754.read(this, offset, false, 52, 8);
	};
	
	function checkInt(buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
	
	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 255;
	  while (++i < byteLength && (mul *= 256)) {
	    this[offset + i] = value / mul & 255;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);
	
	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 255;
	  while (--i >= 0 && (mul *= 256)) {
	    this[offset + i] = value / mul & 255;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = value & 255;
	  return offset + 1;
	};
	
	function objectWriteUInt16(buf, value, offset, littleEndian) {
	  if (value < 0) value = 65535 + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 255;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 255;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};
	
	function objectWriteUInt32(buf, value, offset, littleEndian) {
	  if (value < 0) value = 4294967295 + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = value >>> 24;
	    this[offset + 2] = value >>> 16;
	    this[offset + 1] = value >>> 8;
	    this[offset] = value & 255;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 255;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};
	
	Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }
	
	  var i = 0;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset] = value & 255;
	  while (++i < byteLength && (mul *= 256)) {
	    this[offset + i] = (value / mul >> 0) - sub & 255;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }
	
	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = value < 0 ? 1 : 0;
	  this[offset + i] = value & 255;
	  while (--i >= 0 && (mul *= 256)) {
	    this[offset + i] = (value / mul >> 0) - sub & 255;
	  }
	
	  return offset + byteLength;
	};
	
	Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 255 + value + 1;
	  this[offset] = value & 255;
	  return offset + 1;
	};
	
	Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 255;
	    this[offset + 1] = value >>> 8;
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2;
	};
	
	Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 8;
	    this[offset + 1] = value & 255;
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2;
	};
	
	Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value & 255;
	    this[offset + 1] = value >>> 8;
	    this[offset + 2] = value >>> 16;
	    this[offset + 3] = value >>> 24;
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4;
	};
	
	Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
	  if (value < 0) value = 4294967295 + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value >>> 24;
	    this[offset + 1] = value >>> 16;
	    this[offset + 2] = value >>> 8;
	    this[offset + 3] = value & 255;
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4;
	};
	
	function checkIEEE754(buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds');
	  if (offset + ext > buf.length) throw new RangeError('index out of range');
	  if (offset < 0) throw new RangeError('index out of range');
	}
	
	function writeFloat(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4;
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert);
	};
	
	Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert);
	};
	
	function writeDouble(buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157e+308, -1.7976931348623157e+308);
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8;
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert);
	};
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert);
	};
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy(target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0;
	  if (target.length === 0 || this.length === 0) return 0;
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds');
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
	  if (end < 0) throw new RangeError('sourceEnd out of bounds');
	
	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }
	
	  var len = end - start;
	  var i;
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart);
	  }
	
	  return len;
	};
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill(value, start, end) {
	  if (!value) value = 0;
	  if (!start) start = 0;
	  if (!end) end = this.length;
	
	  if (end < start) throw new RangeError('end < start');
	
	  // Fill 0 bytes; we're done
	  if (end === start) return;
	  if (this.length === 0) return;
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds');
	
	  var i;
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value;
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString());
	    var len = bytes.length;
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len];
	    }
	  }
	
	  return this;
	};
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return new Buffer(this).buffer;
	    } else {
	      var buf = new Uint8Array(this.length);
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i];
	      }
	      return buf.buffer;
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
	  }
	};
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype;
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment(arr) {
	  arr.constructor = Buffer;
	  arr._isBuffer = true;
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set;
	
	  // deprecated
	  arr.get = BP.get;
	  arr.set = BP.set;
	
	  arr.write = BP.write;
	  arr.toString = BP.toString;
	  arr.toLocaleString = BP.toString;
	  arr.toJSON = BP.toJSON;
	  arr.equals = BP.equals;
	  arr.compare = BP.compare;
	  arr.indexOf = BP.indexOf;
	  arr.copy = BP.copy;
	  arr.slice = BP.slice;
	  arr.readUIntLE = BP.readUIntLE;
	  arr.readUIntBE = BP.readUIntBE;
	  arr.readUInt8 = BP.readUInt8;
	  arr.readUInt16LE = BP.readUInt16LE;
	  arr.readUInt16BE = BP.readUInt16BE;
	  arr.readUInt32LE = BP.readUInt32LE;
	  arr.readUInt32BE = BP.readUInt32BE;
	  arr.readIntLE = BP.readIntLE;
	  arr.readIntBE = BP.readIntBE;
	  arr.readInt8 = BP.readInt8;
	  arr.readInt16LE = BP.readInt16LE;
	  arr.readInt16BE = BP.readInt16BE;
	  arr.readInt32LE = BP.readInt32LE;
	  arr.readInt32BE = BP.readInt32BE;
	  arr.readFloatLE = BP.readFloatLE;
	  arr.readFloatBE = BP.readFloatBE;
	  arr.readDoubleLE = BP.readDoubleLE;
	  arr.readDoubleBE = BP.readDoubleBE;
	  arr.writeUInt8 = BP.writeUInt8;
	  arr.writeUIntLE = BP.writeUIntLE;
	  arr.writeUIntBE = BP.writeUIntBE;
	  arr.writeUInt16LE = BP.writeUInt16LE;
	  arr.writeUInt16BE = BP.writeUInt16BE;
	  arr.writeUInt32LE = BP.writeUInt32LE;
	  arr.writeUInt32BE = BP.writeUInt32BE;
	  arr.writeIntLE = BP.writeIntLE;
	  arr.writeIntBE = BP.writeIntBE;
	  arr.writeInt8 = BP.writeInt8;
	  arr.writeInt16LE = BP.writeInt16LE;
	  arr.writeInt16BE = BP.writeInt16BE;
	  arr.writeInt32LE = BP.writeInt32LE;
	  arr.writeInt32BE = BP.writeInt32BE;
	  arr.writeFloatLE = BP.writeFloatLE;
	  arr.writeFloatBE = BP.writeFloatBE;
	  arr.writeDoubleLE = BP.writeDoubleLE;
	  arr.writeDoubleBE = BP.writeDoubleBE;
	  arr.fill = BP.fill;
	  arr.inspect = BP.inspect;
	  arr.toArrayBuffer = BP.toArrayBuffer;
	
	  return arr;
	};
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
	
	function base64clean(str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return '';
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str;
	}
	
	function stringtrim(str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	}
	
	function toHex(n) {
	  if (n < 16) return '0' + n.toString(16);
	  return n.toString(16);
	}
	
	function utf8ToBytes(string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i);
	
	    // is surrogate component
	    if (codePoint > 55295 && codePoint < 57344) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 56319) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(239, 191, 189);
	          continue;
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(239, 191, 189);
	          continue;
	        }
	
	        // valid lead
	        leadSurrogate = codePoint;
	
	        continue;
	      }
	
	      // 2 leads in a row
	      if (codePoint < 56320) {
	        if ((units -= 3) > -1) bytes.push(239, 191, 189);
	        leadSurrogate = codePoint;
	        continue;
	      }
	
	      // valid surrogate pair
	      codePoint = leadSurrogate - 55296 << 10 | codePoint - 56320 | 65536;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(239, 191, 189);
	    }
	
	    leadSurrogate = null;
	
	    // encode utf8
	    if (codePoint < 128) {
	      if ((units -= 1) < 0) break;
	      bytes.push(codePoint);
	    } else if (codePoint < 2048) {
	      if ((units -= 2) < 0) break;
	      bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
	    } else if (codePoint < 65536) {
	      if ((units -= 3) < 0) break;
	      bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
	    } else if (codePoint < 1114112) {
	      if ((units -= 4) < 0) break;
	      bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
	    } else {
	      throw new Error('Invalid code point');
	    }
	  }
	
	  return bytes;
	}
	
	function asciiToBytes(str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 255);
	  }
	  return byteArray;
	}
	
	function utf16leToBytes(str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break;
	
	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }
	
	  return byteArray;
	}
	
	function base64ToBytes(str) {
	  return base64.toByteArray(base64clean(str));
	}
	
	function blitBuffer(src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if (i + offset >= dst.length || i >= src.length) break;
	    dst[i + offset] = src[i];
	  }
	  return i;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1).Buffer, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, Buffer) {(function (global, module) {
	
	  var exports = module.exports;
	
	  /**
	   * Exports.
	   */
	
	  module.exports = expect;
	  expect.Assertion = Assertion;
	
	  /**
	   * Exports version.
	   */
	
	  expect.version = '0.3.1';
	
	  /**
	   * Possible assertion flags.
	   */
	
	  var flags = {
	      not: ['to', 'be', 'have', 'include', 'only']
	    , to: ['be', 'have', 'include', 'only', 'not']
	    , only: ['have']
	    , have: ['own']
	    , be: ['an']
	  };
	
	  function expect (obj) {
	    return new Assertion(obj);
	  }
	
	  /**
	   * Constructor
	   *
	   * @api private
	   */
	
	  function Assertion (obj, flag, parent) {
	    this.obj = obj;
	    this.flags = {};
	
	    if (undefined != parent) {
	      this.flags[flag] = true;
	
	      for (var i in parent.flags) {
	        if (parent.flags.hasOwnProperty(i)) {
	          this.flags[i] = true;
	        }
	      }
	    }
	
	    var $flags = flag ? flags[flag] : keys(flags)
	      , self = this;
	
	    if ($flags) {
	      for (var i = 0, l = $flags.length; i < l; i++) {
	        // avoid recursion
	        if (this.flags[$flags[i]]) continue;
	
	        var name = $flags[i]
	          , assertion = new Assertion(this.obj, name, this)
	
	        if ('function' == typeof Assertion.prototype[name]) {
	          // clone the function, make sure we dont touch the prot reference
	          var old = this[name];
	          this[name] = function () {
	            return old.apply(self, arguments);
	          };
	
	          for (var fn in Assertion.prototype) {
	            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
	              this[name][fn] = bind(assertion[fn], assertion);
	            }
	          }
	        } else {
	          this[name] = assertion;
	        }
	      }
	    }
	  }
	
	  /**
	   * Performs an assertion
	   *
	   * @api private
	   */
	
	  Assertion.prototype.assert = function (truth, msg, error, expected) {
	    var msg = this.flags.not ? error : msg
	      , ok = this.flags.not ? !truth : truth
	      , err;
	
	    if (!ok) {
	      err = new Error(msg.call(this));
	      if (arguments.length > 3) {
	        err.actual = this.obj;
	        err.expected = expected;
	        err.showDiff = true;
	      }
	      throw err;
	    }
	
	    this.and = new Assertion(this.obj);
	  };
	
	  /**
	   * Check if the value is truthy
	   *
	   * @api public
	   */
	
	  Assertion.prototype.ok = function () {
	    this.assert(
	        !!this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
	      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
	  };
	
	  /**
	   * Creates an anonymous function which calls fn with arguments.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.withArgs = function() {
	    expect(this.obj).to.be.a('function');
	    var fn = this.obj;
	    var args = Array.prototype.slice.call(arguments);
	    return expect(function() { fn.apply(null, args); });
	  };
	
	  /**
	   * Assert that the function throws.
	   *
	   * @param {Function|RegExp} callback, or regexp to match error string against
	   * @api public
	   */
	
	  Assertion.prototype.throwError =
	  Assertion.prototype.throwException = function (fn) {
	    expect(this.obj).to.be.a('function');
	
	    var thrown = false
	      , not = this.flags.not;
	
	    try {
	      this.obj();
	    } catch (e) {
	      if (isRegExp(fn)) {
	        var subject = 'string' == typeof e ? e : e.message;
	        if (not) {
	          expect(subject).to.not.match(fn);
	        } else {
	          expect(subject).to.match(fn);
	        }
	      } else if ('function' == typeof fn) {
	        fn(e);
	      }
	      thrown = true;
	    }
	
	    if (isRegExp(fn) && not) {
	      // in the presence of a matcher, ensure the `not` only applies to
	      // the matching.
	      this.flags.not = false;
	    }
	
	    var name = this.obj.name || 'fn';
	    this.assert(
	        thrown
	      , function(){ return 'expected ' + name + ' to throw an exception' }
	      , function(){ return 'expected ' + name + ' not to throw an exception' });
	  };
	
	  /**
	   * Checks if the array is empty.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.empty = function () {
	    var expectation;
	
	    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
	      if ('number' == typeof this.obj.length) {
	        expectation = !this.obj.length;
	      } else {
	        expectation = !keys(this.obj).length;
	      }
	    } else {
	      if ('string' != typeof this.obj) {
	        expect(this.obj).to.be.an('object');
	      }
	
	      expect(this.obj).to.have.property('length');
	      expectation = !this.obj.length;
	    }
	
	    this.assert(
	        expectation
	      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
	    return this;
	  };
	
	  /**
	   * Checks if the obj exactly equals another.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.be =
	  Assertion.prototype.equal = function (obj) {
	    this.assert(
	        obj === this.obj
	      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
	    return this;
	  };
	
	  /**
	   * Checks if the obj sortof equals another.
	   *
	   * @api public
	   */
	
	  Assertion.prototype.eql = function (obj) {
	    this.assert(
	        expect.eql(this.obj, obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
	      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
	      , obj);
	    return this;
	  };
	
	  /**
	   * Assert within start to finish (inclusive).
	   *
	   * @param {Number} start
	   * @param {Number} finish
	   * @api public
	   */
	
	  Assertion.prototype.within = function (start, finish) {
	    var range = start + '..' + finish;
	    this.assert(
	        this.obj >= start && this.obj <= finish
	      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
	      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
	    return this;
	  };
	
	  /**
	   * Assert typeof / instance of
	   *
	   * @api public
	   */
	
	  Assertion.prototype.a =
	  Assertion.prototype.an = function (type) {
	    if ('string' == typeof type) {
	      // proper english in error msg
	      var n = /^[aeiou]/.test(type) ? 'n' : '';
	
	      // typeof with support for 'array'
	      this.assert(
	          'array' == type ? isArray(this.obj) :
	            'regexp' == type ? isRegExp(this.obj) :
	              'object' == type
	                ? 'object' == typeof this.obj && null !== this.obj
	                : type == typeof this.obj
	        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
	    } else {
	      // instanceof
	      var name = type.name || 'supplied constructor';
	      this.assert(
	          this.obj instanceof type
	        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
	        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
	    }
	
	    return this;
	  };
	
	  /**
	   * Assert numeric value above _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.greaterThan =
	  Assertion.prototype.above = function (n) {
	    this.assert(
	        this.obj > n
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
	    return this;
	  };
	
	  /**
	   * Assert numeric value below _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.lessThan =
	  Assertion.prototype.below = function (n) {
	    this.assert(
	        this.obj < n
	      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
	      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
	    return this;
	  };
	
	  /**
	   * Assert string value matches _regexp_.
	   *
	   * @param {RegExp} regexp
	   * @api public
	   */
	
	  Assertion.prototype.match = function (regexp) {
	    this.assert(
	        regexp.exec(this.obj)
	      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
	      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
	    return this;
	  };
	
	  /**
	   * Assert property "length" exists and has value of _n_.
	   *
	   * @param {Number} n
	   * @api public
	   */
	
	  Assertion.prototype.length = function (n) {
	    expect(this.obj).to.have.property('length');
	    var len = this.obj.length;
	    this.assert(
	        n == len
	      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
	      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
	    return this;
	  };
	
	  /**
	   * Assert property _name_ exists, with optional _val_.
	   *
	   * @param {String} name
	   * @param {Mixed} val
	   * @api public
	   */
	
	  Assertion.prototype.property = function (name, val) {
	    if (this.flags.own) {
	      this.assert(
	          Object.prototype.hasOwnProperty.call(this.obj, name)
	        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
	      return this;
	    }
	
	    if (this.flags.not && undefined !== val) {
	      if (undefined === this.obj[name]) {
	        throw new Error(i(this.obj) + ' has no property ' + i(name));
	      }
	    } else {
	      var hasProp;
	      try {
	        hasProp = name in this.obj
	      } catch (e) {
	        hasProp = undefined !== this.obj[name]
	      }
	
	      this.assert(
	          hasProp
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
	    }
	
	    if (undefined !== val) {
	      this.assert(
	          val === this.obj[name]
	        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
	          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
	          + ' of ' + i(val) });
	    }
	
	    this.obj = this.obj[name];
	    return this;
	  };
	
	  /**
	   * Assert that the array contains _obj_ or string contains _obj_.
	   *
	   * @param {Mixed} obj|string
	   * @api public
	   */
	
	  Assertion.prototype.string =
	  Assertion.prototype.contain = function (obj) {
	    if ('string' == typeof this.obj) {
	      this.assert(
	          ~this.obj.indexOf(obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    } else {
	      this.assert(
	          ~indexOf(this.obj, obj)
	        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
	        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
	    }
	    return this;
	  };
	
	  /**
	   * Assert exact keys or inclusion of keys by using
	   * the `.own` modifier.
	   *
	   * @param {Array|String ...} keys
	   * @api public
	   */
	
	  Assertion.prototype.key =
	  Assertion.prototype.keys = function ($keys) {
	    var str
	      , ok = true;
	
	    $keys = isArray($keys)
	      ? $keys
	      : Array.prototype.slice.call(arguments);
	
	    if (!$keys.length) throw new Error('keys required');
	
	    var actual = keys(this.obj)
	      , len = $keys.length;
	
	    // Inclusion
	    ok = every($keys, function (key) {
	      return ~indexOf(actual, key);
	    });
	
	    // Strict
	    if (!this.flags.not && this.flags.only) {
	      ok = ok && $keys.length == actual.length;
	    }
	
	    // Key string
	    if (len > 1) {
	      $keys = map($keys, function (key) {
	        return i(key);
	      });
	      var last = $keys.pop();
	      str = $keys.join(', ') + ', and ' + last;
	    } else {
	      str = i($keys[0]);
	    }
	
	    // Form
	    str = (len > 1 ? 'keys ' : 'key ') + str;
	
	    // Have / include
	    str = (!this.flags.only ? 'include ' : 'only have ') + str;
	
	    // Assertion
	    this.assert(
	        ok
	      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
	      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });
	
	    return this;
	  };
	
	  /**
	   * Assert a failure.
	   *
	   * @param {String ...} custom message
	   * @api public
	   */
	  Assertion.prototype.fail = function (msg) {
	    var error = function() { return msg || "explicit failure"; }
	    this.assert(false, error, error);
	    return this;
	  };
	
	  /**
	   * Function bind implementation.
	   */
	
	  function bind (fn, scope) {
	    return function () {
	      return fn.apply(scope, arguments);
	    }
	  }
	
	  /**
	   * Array every compatibility
	   *
	   * @see bit.ly/5Fq1N2
	   * @api public
	   */
	
	  function every (arr, fn, thisObj) {
	    var scope = thisObj || global;
	    for (var i = 0, j = arr.length; i < j; ++i) {
	      if (!fn.call(scope, arr[i], i, arr)) {
	        return false;
	      }
	    }
	    return true;
	  }
	
	  /**
	   * Array indexOf compatibility.
	   *
	   * @see bit.ly/a5Dxa2
	   * @api public
	   */
	
	  function indexOf (arr, o, i) {
	    if (Array.prototype.indexOf) {
	      return Array.prototype.indexOf.call(arr, o, i);
	    }
	
	    if (arr.length === undefined) {
	      return -1;
	    }
	
	    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
	        ; i < j && arr[i] !== o; i++);
	
	    return j <= i ? -1 : i;
	  }
	
	  // https://gist.github.com/1044128/
	  var getOuterHTML = function(element) {
	    if ('outerHTML' in element) return element.outerHTML;
	    var ns = "http://www.w3.org/1999/xhtml";
	    var container = document.createElementNS(ns, '_');
	    var xmlSerializer = new XMLSerializer();
	    var html;
	    if (document.xmlVersion) {
	      return xmlSerializer.serializeToString(element);
	    } else {
	      container.appendChild(element.cloneNode(false));
	      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
	      container.innerHTML = '';
	      return html;
	    }
	  };
	
	  // Returns true if object is a DOM element.
	  var isDOMElement = function (object) {
	    if (typeof HTMLElement === 'object') {
	      return object instanceof HTMLElement;
	    } else {
	      return object &&
	        typeof object === 'object' &&
	        object.nodeType === 1 &&
	        typeof object.nodeName === 'string';
	    }
	  };
	
	  /**
	   * Inspects an object.
	   *
	   * @see taken from node.js `util` module (copyright Joyent, MIT license)
	   * @api private
	   */
	
	  function i (obj, showHidden, depth) {
	    var seen = [];
	
	    function stylize (str) {
	      return str;
	    }
	
	    function format (value, recurseTimes) {
	      // Provide a hook for user-specified inspect functions.
	      // Check that value is an object with an inspect function on it
	      if (value && typeof value.inspect === 'function' &&
	          // Filter out the util module, it's inspect function is special
	          value !== exports &&
	          // Also filter out any prototype objects using the circular check.
	          !(value.constructor && value.constructor.prototype === value)) {
	        return value.inspect(recurseTimes);
	      }
	
	      // Primitive types cannot have properties
	      switch (typeof value) {
	        case 'undefined':
	          return stylize('undefined', 'undefined');
	
	        case 'string':
	          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
	                                                   .replace(/'/g, "\\'")
	                                                   .replace(/\\"/g, '"') + '\'';
	          return stylize(simple, 'string');
	
	        case 'number':
	          return stylize('' + value, 'number');
	
	        case 'boolean':
	          return stylize('' + value, 'boolean');
	      }
	      // For some reason typeof null is "object", so special case here.
	      if (value === null) {
	        return stylize('null', 'null');
	      }
	
	      if (isDOMElement(value)) {
	        return getOuterHTML(value);
	      }
	
	      // Look up the keys of the object.
	      var visible_keys = keys(value);
	      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;
	
	      // Functions without properties can be shortcutted.
	      if (typeof value === 'function' && $keys.length === 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          var name = value.name ? ': ' + value.name : '';
	          return stylize('[Function' + name + ']', 'special');
	        }
	      }
	
	      // Dates without properties can be shortcutted
	      if (isDate(value) && $keys.length === 0) {
	        return stylize(value.toUTCString(), 'date');
	      }
	      
	      // Error objects can be shortcutted
	      if (value instanceof Error) {
	        return stylize("["+value.toString()+"]", 'Error');
	      }
	
	      var base, type, braces;
	      // Determine the object type
	      if (isArray(value)) {
	        type = 'Array';
	        braces = ['[', ']'];
	      } else {
	        type = 'Object';
	        braces = ['{', '}'];
	      }
	
	      // Make functions say that they are functions
	      if (typeof value === 'function') {
	        var n = value.name ? ': ' + value.name : '';
	        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
	      } else {
	        base = '';
	      }
	
	      // Make dates with properties first say the date
	      if (isDate(value)) {
	        base = ' ' + value.toUTCString();
	      }
	
	      if ($keys.length === 0) {
	        return braces[0] + base + braces[1];
	      }
	
	      if (recurseTimes < 0) {
	        if (isRegExp(value)) {
	          return stylize('' + value, 'regexp');
	        } else {
	          return stylize('[Object]', 'special');
	        }
	      }
	
	      seen.push(value);
	
	      var output = map($keys, function (key) {
	        var name, str;
	        if (value.__lookupGetter__) {
	          if (value.__lookupGetter__(key)) {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Getter/Setter]', 'special');
	            } else {
	              str = stylize('[Getter]', 'special');
	            }
	          } else {
	            if (value.__lookupSetter__(key)) {
	              str = stylize('[Setter]', 'special');
	            }
	          }
	        }
	        if (indexOf(visible_keys, key) < 0) {
	          name = '[' + key + ']';
	        }
	        if (!str) {
	          if (indexOf(seen, value[key]) < 0) {
	            if (recurseTimes === null) {
	              str = format(value[key]);
	            } else {
	              str = format(value[key], recurseTimes - 1);
	            }
	            if (str.indexOf('\n') > -1) {
	              if (isArray(value)) {
	                str = map(str.split('\n'), function (line) {
	                  return '  ' + line;
	                }).join('\n').substr(2);
	              } else {
	                str = '\n' + map(str.split('\n'), function (line) {
	                  return '   ' + line;
	                }).join('\n');
	              }
	            }
	          } else {
	            str = stylize('[Circular]', 'special');
	          }
	        }
	        if (typeof name === 'undefined') {
	          if (type === 'Array' && key.match(/^\d+$/)) {
	            return str;
	          }
	          name = json.stringify('' + key);
	          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	            name = name.substr(1, name.length - 2);
	            name = stylize(name, 'name');
	          } else {
	            name = name.replace(/'/g, "\\'")
	                       .replace(/\\"/g, '"')
	                       .replace(/(^"|"$)/g, "'");
	            name = stylize(name, 'string');
	          }
	        }
	
	        return name + ': ' + str;
	      });
	
	      seen.pop();
	
	      var numLinesEst = 0;
	      var length = reduce(output, function (prev, cur) {
	        numLinesEst++;
	        if (indexOf(cur, '\n') >= 0) numLinesEst++;
	        return prev + cur.length + 1;
	      }, 0);
	
	      if (length > 50) {
	        output = braces[0] +
	                 (base === '' ? '' : base + '\n ') +
	                 ' ' +
	                 output.join(',\n  ') +
	                 ' ' +
	                 braces[1];
	
	      } else {
	        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	      }
	
	      return output;
	    }
	    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
	  }
	
	  expect.stringify = i;
	
	  function isArray (ar) {
	    return Object.prototype.toString.call(ar) === '[object Array]';
	  }
	
	  function isRegExp(re) {
	    var s;
	    try {
	      s = '' + re;
	    } catch (e) {
	      return false;
	    }
	
	    return re instanceof RegExp || // easy case
	           // duck-type for context-switching evalcx case
	           typeof(re) === 'function' &&
	           re.constructor.name === 'RegExp' &&
	           re.compile &&
	           re.test &&
	           re.exec &&
	           s.match(/^\/.*\/[gim]{0,3}$/);
	  }
	
	  function isDate(d) {
	    return d instanceof Date;
	  }
	
	  function keys (obj) {
	    if (Object.keys) {
	      return Object.keys(obj);
	    }
	
	    var keys = [];
	
	    for (var i in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, i)) {
	        keys.push(i);
	      }
	    }
	
	    return keys;
	  }
	
	  function map (arr, mapper, that) {
	    if (Array.prototype.map) {
	      return Array.prototype.map.call(arr, mapper, that);
	    }
	
	    var other= new Array(arr.length);
	
	    for (var i= 0, n = arr.length; i<n; i++)
	      if (i in arr)
	        other[i] = mapper.call(that, arr[i], i, arr);
	
	    return other;
	  }
	
	  function reduce (arr, fun) {
	    if (Array.prototype.reduce) {
	      return Array.prototype.reduce.apply(
	          arr
	        , Array.prototype.slice.call(arguments, 1)
	      );
	    }
	
	    var len = +this.length;
	
	    if (typeof fun !== "function")
	      throw new TypeError();
	
	    // no value to return if no initial value and an empty array
	    if (len === 0 && arguments.length === 1)
	      throw new TypeError();
	
	    var i = 0;
	    if (arguments.length >= 2) {
	      var rv = arguments[1];
	    } else {
	      do {
	        if (i in this) {
	          rv = this[i++];
	          break;
	        }
	
	        // if array contains no values, no initial value to return
	        if (++i >= len)
	          throw new TypeError();
	      } while (true);
	    }
	
	    for (; i < len; i++) {
	      if (i in this)
	        rv = fun.call(null, rv, this[i], i, this);
	    }
	
	    return rv;
	  }
	
	  /**
	   * Asserts deep equality
	   *
	   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
	   * @api private
	   */
	
	  expect.eql = function eql(actual, expected) {
	    // 7.1. All identical values are equivalent, as determined by ===.
	    if (actual === expected) {
	      return true;
	    } else if ('undefined' != typeof Buffer
	      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
	      if (actual.length != expected.length) return false;
	
	      for (var i = 0; i < actual.length; i++) {
	        if (actual[i] !== expected[i]) return false;
	      }
	
	      return true;
	
	      // 7.2. If the expected value is a Date object, the actual value is
	      // equivalent if it is also a Date object that refers to the same time.
	    } else if (actual instanceof Date && expected instanceof Date) {
	      return actual.getTime() === expected.getTime();
	
	      // 7.3. Other pairs that do not both pass typeof value == "object",
	      // equivalence is determined by ==.
	    } else if (typeof actual != 'object' && typeof expected != 'object') {
	      return actual == expected;
	    // If both are regular expression use the special `regExpEquiv` method
	    // to determine equivalence.
	    } else if (isRegExp(actual) && isRegExp(expected)) {
	      return regExpEquiv(actual, expected);
	    // 7.4. For all other Object pairs, including Array objects, equivalence is
	    // determined by having the same number of owned properties (as verified
	    // with Object.prototype.hasOwnProperty.call), the same set of keys
	    // (although not necessarily the same order), equivalent values for every
	    // corresponding key, and an identical "prototype" property. Note: this
	    // accounts for both named and indexed properties on Arrays.
	    } else {
	      return objEquiv(actual, expected);
	    }
	  };
	
	  function isUndefinedOrNull (value) {
	    return value === null || value === undefined;
	  }
	
	  function isArguments (object) {
	    return Object.prototype.toString.call(object) == '[object Arguments]';
	  }
	
	  function regExpEquiv (a, b) {
	    return a.source === b.source && a.global === b.global &&
	           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
	  }
	
	  function objEquiv (a, b) {
	    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	      return false;
	    // an identical "prototype" property.
	    if (a.prototype !== b.prototype) return false;
	    //~~~I've managed to break Object.keys through screwy arguments passing.
	    //   Converting to array solves the problem.
	    if (isArguments(a)) {
	      if (!isArguments(b)) {
	        return false;
	      }
	      a = pSlice.call(a);
	      b = pSlice.call(b);
	      return expect.eql(a, b);
	    }
	    try{
	      var ka = keys(a),
	        kb = keys(b),
	        key, i;
	    } catch (e) {//happens when one is a string literal and the other isn't
	      return false;
	    }
	    // having the same number of owned properties (keys incorporates hasOwnProperty)
	    if (ka.length != kb.length)
	      return false;
	    //the same set of keys (although not necessarily the same order),
	    ka.sort();
	    kb.sort();
	    //~~~cheap key test
	    for (i = ka.length - 1; i >= 0; i--) {
	      if (ka[i] != kb[i])
	        return false;
	    }
	    //equivalent values for every corresponding key, and
	    //~~~possibly expensive deep test
	    for (i = ka.length - 1; i >= 0; i--) {
	      key = ka[i];
	      if (!expect.eql(a[key], b[key]))
	         return false;
	    }
	    return true;
	  }
	
	  var json = (function () {
	    "use strict";
	
	    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
	      return {
	          parse: nativeJSON.parse
	        , stringify: nativeJSON.stringify
	      }
	    }
	
	    var JSON = {};
	
	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }
	
	    function date(d, key) {
	      return isFinite(d.valueOf()) ?
	          d.getUTCFullYear()     + '-' +
	          f(d.getUTCMonth() + 1) + '-' +
	          f(d.getUTCDate())      + 'T' +
	          f(d.getUTCHours())     + ':' +
	          f(d.getUTCMinutes())   + ':' +
	          f(d.getUTCSeconds())   + 'Z' : null;
	    }
	
	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;
	
	
	    function quote(string) {
	
	  // If the string contains no control characters, no quote characters, and no
	  // backslash characters, then we can safely slap some quotes around it.
	  // Otherwise we must also replace the offending characters with safe escape
	  // sequences.
	
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string' ? c :
	                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }
	
	
	    function str(key, holder) {
	
	  // Produce a string from holder[key].
	
	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];
	
	  // If the value has a toJSON method, call it to obtain a replacement value.
	
	        if (value instanceof Date) {
	            value = date(key);
	        }
	
	  // If we were called with a replacer function, then call the replacer to
	  // obtain a replacement value.
	
	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }
	
	  // What happens next depends on the value's type.
	
	        switch (typeof value) {
	        case 'string':
	            return quote(value);
	
	        case 'number':
	
	  // JSON numbers must be finite. Encode non-finite numbers as null.
	
	            return isFinite(value) ? String(value) : 'null';
	
	        case 'boolean':
	        case 'null':
	
	  // If the value is a boolean or null, convert it to a string. Note:
	  // typeof null does not produce 'null'. The case is included here in
	  // the remote chance that this gets fixed someday.
	
	            return String(value);
	
	  // If the type is 'object', we might be dealing with an object or an array or
	  // null.
	
	        case 'object':
	
	  // Due to a specification blunder in ECMAScript, typeof null is 'object',
	  // so watch out for that case.
	
	            if (!value) {
	                return 'null';
	            }
	
	  // Make an array to hold the partial results of stringifying this object value.
	
	            gap += indent;
	            partial = [];
	
	  // Is the value an array?
	
	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	
	  // The value is an array. Stringify every element. Use null as a placeholder
	  // for non-JSON values.
	
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	
	  // Join all of the elements together, separated with commas, and wrap them in
	  // brackets.
	
	                v = partial.length === 0 ? '[]' : gap ?
	                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
	                    '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }
	
	  // If the replacer is an array, use it to select the members to be stringified.
	
	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {
	
	  // Otherwise, iterate through all of the keys in the object.
	
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }
	
	  // Join all of the member texts together, separated with commas,
	  // and wrap them in braces.
	
	            v = partial.length === 0 ? '{}' : gap ?
	                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
	                '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }
	
	  // If the JSON object does not yet have a stringify method, give it one.
	
	    JSON.stringify = function (value, replacer, space) {
	
	  // The stringify method takes a value and an optional replacer, and an optional
	  // space parameter, and returns a JSON text. The replacer can be a function
	  // that can replace values, or an array of strings that will select the keys.
	  // A default replacer method can be provided. Use of the space parameter can
	  // produce text that is more easily readable.
	
	        var i;
	        gap = '';
	        indent = '';
	
	  // If the space parameter is a number, make an indent string containing that
	  // many spaces.
	
	        if (typeof space === 'number') {
	            for (i = 0; i < space; i += 1) {
	                indent += ' ';
	            }
	
	  // If the space parameter is a string, it will be used as the indent string.
	
	        } else if (typeof space === 'string') {
	            indent = space;
	        }
	
	  // If there is a replacer, it must be a function or an array.
	  // Otherwise, throw an error.
	
	        rep = replacer;
	        if (replacer && typeof replacer !== 'function' &&
	                (typeof replacer !== 'object' ||
	                typeof replacer.length !== 'number')) {
	            throw new Error('JSON.stringify');
	        }
	
	  // Make a fake root object containing our value under the key of ''.
	  // Return the result of stringifying the value.
	
	        return str('', {'': value});
	    };
	
	  // If the JSON object does not yet have a parse method, give it one.
	
	    JSON.parse = function (text, reviver) {
	    // The parse method takes a text and an optional reviver function, and returns
	    // a JavaScript value if the text is a valid JSON text.
	
	        var j;
	
	        function walk(holder, key) {
	
	    // The walk method is used to recursively walk the resulting structure so
	    // that modifications can be made.
	
	            var k, v, value = holder[key];
	            if (value && typeof value === 'object') {
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = walk(value, k);
	                        if (v !== undefined) {
	                            value[k] = v;
	                        } else {
	                            delete value[k];
	                        }
	                    }
	                }
	            }
	            return reviver.call(holder, key, value);
	        }
	
	
	    // Parsing happens in four stages. In the first stage, we replace certain
	    // Unicode characters with escape sequences. JavaScript handles many characters
	    // incorrectly, either silently deleting them, or treating them as line endings.
	
	        text = String(text);
	        cx.lastIndex = 0;
	        if (cx.test(text)) {
	            text = text.replace(cx, function (a) {
	                return '\\u' +
	                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	            });
	        }
	
	    // In the second stage, we run the text against regular expressions that look
	    // for non-JSON patterns. We are especially concerned with '()' and 'new'
	    // because they can cause invocation, and '=' because it can cause mutation.
	    // But just to be safe, we want to reject all unexpected forms.
	
	    // We split the second stage into 4 regexp operations in order to work around
	    // crippling inefficiencies in IE's and Safari's regexp engines. First we
	    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
	    // replace all simple value tokens with ']' characters. Third, we delete all
	    // open brackets that follow a colon or comma or that begin the text. Finally,
	    // we look to see that the remaining characters are only whitespace or ']' or
	    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
	
	        if (/^[\],:{}\s]*$/
	                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	
	    // In the third stage we use the eval function to compile the text into a
	    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
	    // in JavaScript: it can begin a block or an object literal. We wrap the text
	    // in parens to eliminate the ambiguity.
	
	            j = eval('(' + text + ')');
	
	    // In the optional fourth stage, we recursively walk the new structure, passing
	    // each name/value pair to a reviver function for possible transformation.
	
	            return typeof reviver === 'function' ?
	                walk({'': j}, '') : j;
	        }
	
	    // If the text is not JSON parseable, then a SyntaxError is thrown.
	
	        throw new SyntaxError('JSON.parse');
	    };
	
	    return JSON;
	  })();
	
	  if ('undefined' != typeof window) {
	    window.expect = module.exports;
	  }
	
	})(
	    this
	  ,  true ? module : {exports: {}}
	);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module), __webpack_require__(1).Buffer))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	var expect = __webpack_require__(2);
	var detector = __webpack_require__(5);
	var win = typeof window === "undefined" ? global : window;
	
	function isBlinkEngine() {
	  return "chrome" in win && "CSS" in win;
	}
	
	var UAs = [
	// Windows 10, Edge browser.
	["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10162", {
	  device: "pc/-1",
	  os: "windows/10.0",
	  browser: "edge/12.10162;12.10162;o",
	  //      name/version;mode;compatible
	  //                        c: compatible; o: origin, not compatible.
	  engine: "edgehtml/12.10162;12.10162;o" }], ["Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko", {
	  device: "pc/-1",
	  os: "windows/10.0",
	  browser: "ie/11.0;11.0;o",
	  //      name/version;mode;compatible
	  //                        c: compatible; o: origin, not compatible.
	  engine: "trident/7.0;7.0;o" }],
	// Windows Blue
	["Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv 11.0) like Gecko", {
	  device: "pc/-1",
	  os: "windows/6.3",
	  browser: "ie/11.0;11.0;o",
	  //      name/version;mode;compatible
	  //                        c: compatible; o: origin, not compatible.
	  engine: "trident/7.0;7.0;o" }], ["Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko", {
	  device: "pc/-1",
	  os: "windows/6.3",
	  browser: "ie/11.0;11.0;o",
	  engine: "trident/7.0;7.0;o" }],
	// 兼容模式
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C)", {
	  device: "pc/-1",
	  os: "windows/6.3",
	  browser: "ie/11.0;7.0;c",
	  engine: "trident/7.0;3.0;c" }], ["Mozilla/5.0 (IE 11.0; Windows NT 6.3; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko", {
	  device: "pc/-1",
	  os: "windows/6.3",
	  browser: "ie/11.0;11.0;o",
	  engine: "trident/7.0;7.0;o" }], ["Mozilla/5.0 (IE 7.0; Windows NT 6.3; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko", {
	  device: "pc/-1",
	  os: "windows/6.3",
	  browser: "ie/11.0;7.0;c",
	  engine: "trident/7.0;3.0;c" }],
	// Windows 7, IE10
	["Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/10.0;10.0;o",
	  engine: "trident/6.0;6.0;o" }],
	// Windows 7, IE10(兼 容模式)
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/10.0;7.0;c",
	  engine: "trident/6.0;3.0;c" }],
	// Windows 7, IE9
	["Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/9.0;9.0;o",
	  engine: "trident/5.0;5.0;o" }],
	// Windows 7, IE9(兼 容模式)
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/9.0;7.0;c",
	  engine: "trident/5.0;3.0;c" }],
	// Windows 7, IE8
	["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/8.0;8.0;o",
	  engine: "trident/4.0;4.0;o" }],
	// Windows 7, IE8(兼容模式)
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/8.0;7.0;c",
	  engine: "trident/4.0;3.0;c" }],
	// Windows XP, IE8
	["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
	  device: "pc/-1",
	  os: "windows/5.1",
	  browser: "ie/8.0;8.0;o",
	  engine: "trident/4.0;4.0;o" }],
	// Windows XP, IE8(兼容模式)
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; .NET CLR 2.0.50727)", {
	  device: "pc/-1",
	  os: "windows/5.1",
	  browser: "ie/8.0;7.0;c",
	  engine: "trident/4.0;3.0;c" }],
	// Windows XP, IE7
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727)", {
	  device: "pc/-1",
	  os: "windows/5.1",
	  browser: "ie/7.0;7.0;o",
	  engine: "trident/3.0;3.0;o" }],
	// Windows XP, IE6
	["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 2.0.50727)", {
	  device: "pc/-1",
	  os: "windows/5.1",
	  browser: "ie/6.0;6.0;o",
	  engine: "trident/2.0;2.0;o" }],
	
	// Macintosh, Chrome
	["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17", {
	  device: "mac/-1",
	  os: "macosx/10.7.5",
	  browser: "chrome/24.0.1312.56;24.0.1312.56;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o" }], ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.99 Safari/537.22", {
	  device: "mac/-1",
	  os: "macosx/10.8.3",
	  browser: "chrome/25.0.1364.99;25.0.1364.99;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.22;537.22;o" }], ["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 Safari/537.31", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "chrome/26.0.1410.43;26.0.1410.43;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.31;537.31;o" }],
	// Macintosh Safari.
	["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/536.26.17 (KHTML, like Gecko) Version/6.0.2 Safari/536.26.17", {
	  device: "mac/-1",
	  os: "macosx/10.7.5",
	  browser: "safari/6.0.2;6.0.2;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26.17;536.26.17;o" }], ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/536.28.10 (KHTML, like Gecko) Version/6.0.3 Safari/536.28.10", {
	  device: "mac/-1",
	  os: "macosx/10.8.3",
	  browser: "safari/6.0.3;6.0.3;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.28.10;536.28.10;o" }],
	// Macintosh, Firefox.
	["Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:19.0) Gecko/20100101 Firefox/19.0", {
	  device: "mac/-1",
	  os: "macosx/10.8",
	  browser: "firefox/19.0;19.0;o",
	  engine: "gecko/19.0.20100101;19.0.20100101;o" }],
	// Macintosh Opera.
	["Opera/9.80 (Macintosh; Intel Mac OS X 10.8.3) Presto/2.12.388 Version/12.15", {
	  device: "mac/-1",
	  os: "macosx/10.8.3",
	  browser: "opera/12.15;12.15;o",
	  engine: "presto/2.12.388;2.12.388;o" }], ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.20 Safari/537.36 OPR/15.0.1147.18 (Edition Next)", {
	  device: "mac/-1",
	  os: "macosx/10.8.3",
	  browser: "opera/15.0.1147.18;15.0.1147.18;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }],
	
	// 360 安全浏览器，急速模式
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1 QIHU 360SE", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "360/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.1;537.1;o" }],
	// 360 安全浏览器，兼容模式。XXX: 无法识别真实 360 信息。
	["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/8.0;8.0;o",
	  engine: "trident/4.0;4.0;o" }],
	// 360 急速浏览器，急速模式
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17 QIHU 360EE", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "360/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o" }],
	// 360 安全浏览器，兼容模式。XXX: 无法识别真实 360 信息。
	["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/8.0;8.0;o",
	  engine: "trident/4.0;4.0;o" }],
	// TheWorld
	["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; qihu theworld)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "theworld/-1;8.0;o",
	  engine: "trident/4.0;4.0;o" }],
	// TheWorld 急速版。
	// XXX: IE 内核的浏览器可以通过 IEMode 函数统一处理并修复版本号。
	//      非 IE 内核的改比较难统一处理。
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.79 Safari/535.11 QIHU THEWORLD ", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "theworld/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/535.11;535.11;o" }],
	// TheWorld 急速版，兼容模式
	["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; QIHU THEWORLD)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "theworld/-1;8.0;o",
	  engine: "trident/4.0;4.0;o" }], ["Mozilla/5.0 (Windows NT 5.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 TheWorld 6", {
	  device: "pc/-1",
	  os: "windows/5.2",
	  browser: "theworld/6;6;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }],
	// Maxthon
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Maxthon/4.0.5.4000 Chrome/26.0.1410.43 Safari/537.1", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "maxthon/4.0.5.4000;4.0.5.4000;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.1;537.1;o" }],
	// QQBrowser
	["Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; QQBrowser/7.3.8126.400)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "qq/7.3.8126.400;8.0;o",
	  engine: "trident/4.0;4.0;o" }], ["MQQBrowser/3.7/Mozilla/5.0 (Linux; U; Android 2.3.3; zh-cn; HW-HUAWEI_C8650/C8650V100R001C92B825; 320*480; CTC/2.0) AppleWebKit/533.1 Mobile Safari/533.1", {
	  device: "huawei/c8650",
	  os: "android/2.3.3",
	  browser: "qq/3.7;3.7;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["HUAWEI U8825D Build/HuaweiU8825D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "huawei/u8825d",
	  os: "na/-1",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["HuaweiT8100_TD/1.0 Android/2.2 Release/12.25.2010 Browser/WAP2.0 Profile/MIDP-2.0 Configuration/CLDC-1.1 AppleWebKit/533.1", {
	  device: "huawei/t8100",
	  os: "android/2.2",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["HUAWEI-HUAWEI-Y-220T/1.0 Linux/2.6.35.7 Android/2.3.5 Release/11.28.2012 Browser/AppleWebKit533.1 (KHTML%2C like Gecko) Mozilla/5.0 Mobile", {
	  device: "huawei/y-220t",
	  os: "android/2.3.5",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; U8818 Build/HuaweiU8818) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "huawei/u8818",
	  os: "android/2.3.6",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["JUC (Linux; U; 4.1.2; zh-cn; Nexus S; 480*800) UCWEB8.7.2.214/145/800", {
	  device: "nexus/s",
	  os: "linux/-1",
	  browser: "uc/8.7.2.214;8.7.2.214;o",
	  engine: "na/-1;-1;o" }], ["Lenovo A356:Mozilla/5.0 (Linux; U;  Android 4.0.4; zh-cn; Lenovo A356/S030) AppleWebKit534.30 (KHTML%2C like Gecko) Version/4.0 Mobile Safari/534.30", {
	  device: "lenovo/a356",
	  os: "android/4.0.4",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Lenovo-A60/S100 Linux/2.6.35.7 Android/2.3.3 Release/04.19.2011 Browser/AppleWebKit533.1 Profile/ Configuration/", {
	  device: "lenovo/a60",
	  os: "android/2.3.3",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["LENOVO-Lenovo-A288t/1.0 Linux/2.6.35.7 Android/2.3.5 Release/08.16.2012 Browser/AppleWebKit533.1 (KHTML%2C like Gecko) Mozilla/5.0 Mobile", {
	  device: "lenovo/a288t",
	  os: "android/2.3.5",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["LenovoS899t_TD/1.0 Android/4.0 Release/02.01.2012 Browser/WAP2.0 appleWebkit/534.30; 360browser(securitypay%2Csecurityinstalled); 360(android%2Cuppayplugin); 360 Aphone Browser (4.7.1)", {
	  device: "lenovo/s899t",
	  os: "android/4.0",
	  browser: "360/4.7.1;4.7.1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["ZTE-TU960s_TD/1.0 Linux/2.6.35 Android/2.3 Release/9.25.2011 Browser/AppleWebKit533.1", {
	  device: "zte/u960s",
	  os: "android/2.3",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["ZTEU880E_TD/1.0 Linux/2.6.35 Android/2.3 Release/12.15.2011 Browser/AppleWebKit533.1", {
	  device: "zte/u880e",
	  os: "android/2.3",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn;generic-ZTE U930/Phone Build/IMM76D) AppleWebKit534.30(KHTML%2Clike Gecko)Version/4.0 Mobile Safari/534.30 Id/EA71A15E1E65D2518F09B2C659CA09E1 RV/4.0.1;gngouua1.3.0.g chl/anzhi", {
	  device: "zte/u930",
	  os: "android/4.0.3",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Mozilla/5.0 (Linux; U; Android 2.2.2; zh-cn; ZTE-T U880 Build/FRG83G) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "zte/u880",
	  os: "android/2.2.2",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; ZTE U795 Build/IMM76D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "zte/u795",
	  os: "android/4.0.4",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["ZTEU795+_TD/1.0 Linux/3.0.13 Android/4.0 Release/7.10.2012 Browser/AppleWebKit534.30", {
	  device: "zte/u795+",
	  os: "android/4.0",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; ZTE-U V881 Build/GINGERBREAD) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "zte/v881",
	  os: "android/2.3.5",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; vivo E1 Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "vivo/e1",
	  os: "android/2.3.5",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["NokiaC7-00/111.040.1511 (Symbian/3; Series60/5.3 Mozilla/5.0; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML%2C like Gecko) Version/3.0 NokiaBrowser/8.3.1.4", {
	  device: "nokia/c7",
	  os: "symbian/3",
	  browser: "nokia/8.3.1.4;8.3.1.4;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/525;525;o" }], ["Mozilla/5.0 (Linux; U; Android 4.1.5; zh-cn; HTC_X315e Build/IML74K) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/x315e",
	  os: "android/4.1.5",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; HTC T328d Build/IML74K) UC AppleWebKit/530+ (KHTML%2C like Gecko) Mobile Safari/530", {
	  device: "htc/t328d",
	  os: "android/4.0.3",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/530+;530+;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; HTC-T329d/1.11.1401.1) AndroidWebKit/534.30 (KHTML%2C Like Gecko) Version/4.0 Mobile Safari/534.30", {
	  device: "htc/t329d",
	  os: "android/4.0.4",
	  browser: "android/4.0;4.0;o",
	  engine: "androidwebkit/534.30;534.30;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.5; en-es; HTC Incredible S Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/incredible s",
	  os: "android/2.3.5",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["JUC (Linux; U; 2.3.5; zh-cn; HTC Rhyme S510b; 480*800) UCWEB8.7.4.225/145/800", {
	  device: "htc/rhyme s510b",
	  os: "linux/-1",
	  browser: "uc/8.7.4.225;8.7.4.225;o",
	  engine: "na/-1;-1;o" }], ["UCWEB/2.0 (Linux; U; Adr Android 4.0.8; zh-CN; HTC inspire4G(LTE)) U2/1.0.0 UCBrowser/8.8.3.278 U2/1.0.0 Mobile", {
	  device: "htc/inspire4g",
	  os: "android/4.0.8",
	  browser: "uc/8.8.3.278;8.8.3.278;o",
	  engine: "u2/1.0.0;1.0.0;o" }], ["Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC Magic Build/FRG83) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/magic",
	  os: "android/2.2.1",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; HTC Sensation Z710e Build/IML74K) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/sensation z710e",
	  os: "android/4.0.3",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.3; zh-cn; HTC Wildfire S A510e Build/GRI40) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/wildfire s a510e",
	  os: "android/2.3.3",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 2.2.1; en-sg; HTC Wildfire Build/FRG83D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/wildfire",
	  os: "android/2.2.1",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; HTC Desire S Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/desire s",
	  os: "android/2.3.5",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 4.2.1; zh-cn; HTC Rezound Build/IML74K) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/rezound",
	  os: "android/4.2.1",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; HTC One X Build/IMM76D) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "htc/one x",
	  os: "android/4.0.4",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["HTCT329t_TD/1.0 Android/4.0 release/2012 Browser/WAP2.0 Profile/MIDP-2.0 Configuration/CLDC-1.1", {
	  device: "htc/t329t",
	  os: "android/4.0",
	  browser: "na/-1;-1;o",
	  engine: "na/-1;-1;o" }],
	// TT
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; TencentTraveler 4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "tt/4.0;7.0;c",
	  engine: "trident/4.0;3.0;c" }],
	//GreenBrowser.
	["Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; GreenBrowser)", {
	  device: "pc/-1",
	  os: "windows/5.0",
	  browser: "green/-1;6.0;o",
	  engine: "trident/2.0;2.0;o" }], ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 2.0.50727; GreenBrowser)", {
	  device: "pc/-1",
	  os: "windows/5.1",
	  browser: "green/-1;7.0;o",
	  engine: "trident/3.0;3.0;o" }], ["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.1.4322; InfoPath.1; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30; GreenBrowser)", {
	  device: "pc/-1",
	  os: "windows/5.1",
	  browser: "green/-1;7.0;o",
	  engine: "trident/3.0;3.0;o" }],
	// 枫树浏览器
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17 CoolNovo/2.0.6.12", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "coolnovo/2.0.6.12;2.0.6.12;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o" }],
	// 枫树浏览器，兼容模式。XXX: 误识别。
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "ie/8.0;7.0;c",
	  engine: "trident/4.0;3.0;c" }],
	// 闪游浏览器
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SaaYaa)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "saayaa/-1;7.0;c",
	  engine: "trident/4.0;3.0;c" }],
	// 猎豹浏览器。TODO: 识别非 IE 内核浏览的模式。
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1 LBBROWSER", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "liebao/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.1;537.1;o" }],
	// 闪游浏览器，兼容模式
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SaaYaa)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "saayaa/-1;7.0;c",
	  engine: "trident/4.0;3.0;c" }],
	// 淘宝浏览器
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.11 TaoBrowser/3.1 Safari/536.11", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "tao/3.1;3.1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.11;536.11;o" }],
	// 百度浏览器
	["Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; BIDUBrowser 2.x)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "baidu/2.x;9.0;o",
	  engine: "trident/5.0;5.0;o" }],
	// 百度浏览器，兼容模式
	["Mozilla/5.0 (Windows; U; Windows NT 6.1; zh_CN) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/18.0 BIDUBrowser/2.x Safari/534.7", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "baidu/2.x;2.x;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.7;534.7;o" }],
	// 搜狗浏览器
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; SE 2.X MetaSr 1.0)", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "sogou/2.x;7.0;c",
	  engine: "trident/5.0;3.0;c" }],
	// 搜狗浏览器，兼容模式
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.57 Safari/537.17 SE 2.X MetaSr 1.0", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "sogou/2.x;2.x;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.17;537.17;o" }],
	
	// iPhone, Chrome.
	["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) CriOS/26.0.1410.50 Mobile/10B329 Safari/8536.25 (C0106E13-AA1D-4473-A60E-814F80A82BD7)", {
	  device: "iphone/-1",
	  os: "ios/6.1.3",
	  browser: "chrome/26.0.1410.50;26.0.1410.50;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o" }], ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25", {
	  device: "iphone/-1",
	  os: "ios/6.1.3",
	  browser: "safari/6.0;6.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o" }], ["UCWEB/2.0 (iOS; U; iPh OS 6_1_2; zh-CN; iPh4%2C1) U2/1.0.0 UCBrowser/9.0.1.284 U2/1.0.0 Mobile", {
	  device: "iphone/4",
	  os: "ios/6.1.2",
	  browser: "uc/9.0.1.284;9.0.1.284;o",
	  engine: "u2/1.0.0;1.0.0;o" }], ["UCWEB/2.0 (iOS; U; iPh OS 5_1_1; zh-CN; iPh3%2C1) U2/1.0.0 UCBrowser/9.0.0.260 U2/1.0.0 Mobile", {
	  device: "iphone/3",
	  os: "ios/5.1.1",
	  browser: "uc/9.0.0.260;9.0.0.260;o",
	  engine: "u2/1.0.0;1.0.0;o" }],
	// iPad mini.
	["Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25", {
	  device: "ipad/-1",
	  os: "ios/6.1.3",
	  browser: "safari/6.0;6.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o" }],
	
	// iPad, Safari. XXX: 实际是 Safari，但是没有 Safari 标识。
	["Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405", {
	  device: "ipad/-1",
	  os: "ios/3.2.1",
	  browser: "webview/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/531.21.10;531.21.10;o" }],
	// iPad mini, MIHtool. WebView.
	["Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B329", {
	  device: "ipad/-1",
	  os: "ios/6.1.3",
	  browser: "webview/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o" }], ["Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML%2C like Gecko) Mobile/9A405", {
	  device: "ipad/-1",
	  os: "ios/5.0.1",
	  browser: "webview/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.46;534.46;o" }], ["Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_2 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Mobile/10B146", {
	  device: "iphone/-1",
	  os: "ios/6.1.2",
	  browser: "webview/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/536.26;536.26;o" }],
	// Windows Phone, IE9
	["Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Nokia 620)", {
	  device: "nokia/620",
	  os: "wp/8.0",
	  browser: "ie/10.0;10.0;o",
	  engine: "trident/6.0;6.0;o" }], ["Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; SAMSUNG SGH-i917)", {
	  device: "samsung/i917",
	  os: "wp/7.5",
	  browser: "ie/9.0;9.0;o",
	  engine: "trident/5.0;5.0;o" }],
	// Windows Phone, IE9
	["Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; XBLWP7; ZuneWP7)", {
	  device: "wp/-1",
	  os: "wp/7",
	  browser: "ie/7.0;7.0;o",
	  engine: "trident/3.0;3.0;o" }],
	// Windows CE
	["Mozilla/5.0 (Windows; U; Windows CE 5.1; rv:1.8.1a3) Gecko/20060610 Minimo/0.016", {
	  device: "wp/-1",
	  os: "windowsce/5.1",
	  browser: "na/-1;-1;o",
	  engine: "gecko/1.8.1a3.20060610;1.8.1a3.20060610;o" }], ["Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; 176x220)", {
	  device: "wp/-1",
	  os: "windowsce/-1",
	  browser: "ie/4.01;4.01;o",
	  engine: "trident/0.01;0.01;o" }],
	// Nexus 7
	["Mozilla/5.0 (Linux; Android 4.2.2; Nexus 7 Build/JDQ39) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.169 Safari/537.22", {
	  device: "nexus/7",
	  os: "android/4.2.2",
	  browser: "chrome/25.0.1364.169;25.0.1364.169;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.22;537.22;o" }],
	// 小米浏览器
	["Mozilla/5.0 (Linux; U; Android 4.1.1; zh-cn; MI 2 Build/JRO03L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 XiaoMi/MiuiBrowser/1.0", {
	  device: "mi/2",
	  os: "android/4.1.1",
	  browser: "mi/1.0;1.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }],
	// 小米手机
	["Mozilla/5.0 (Linux; U; Android 4.0.1; zh-cn; MI-ONE Plus Build/ITL41D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 ", {
	  device: "mi/one plus",
	  os: "android/4.0.1",
	  // XXX: Android 默认浏览器怎么会是 Safari 浏览器？
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Mozilla/5.0 (Linux; U; Android 4.1.1; zh-cn; M040 Build/JRO03H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30", {
	  device: "meizu/040",
	  os: "android/4.1.1",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["meizu/9|Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; M9 Build/GRJ90) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "meizu/9",
	  os: "android/2.3.5",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 4.2.1; zh-cn; M040 Build/JOP40D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30", {
	  device: "meizu/040",
	  os: "android/4.2.1",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; MEIZU MX Build/GRJ90) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobiile Safari/533.1", {
	  device: "meizu/mx",
	  os: "android/2.3.5",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; MX4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36", {
	  device: "meizu/x4",
	  os: "android/4.4.2",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; MT15i Build/4.1.B.0.431) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "sonyericsson/15i",
	  os: "android/4.0.4",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["CoolPad8190_CMCC_TD/1.0 Linux/3.0.8 Android/4.0 Release/10.15.2012 Browser/AppleWebkit534.3", {
	  device: "coolpad/8190",
	  os: "android/4.0",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.3;534.3;o" }], ["CoolPad8060_CMCC_TD/1.0 Linux/2.6.35 Android/2.3 Release/8.30.2012 Browser/AppleWebkit533.1", {
	  device: "coolpad/8060",
	  os: "android/2.3",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn;YL-Coolpad_7260A/2.3.002.120217.7260+; 480*800; CUCC/3.0) CoolpadWebkit/533.1", {
	  device: "coolpad/7260a",
	  os: "android/2.3.5",
	  browser: "na/-1;-1;o",
	  engine: "coolpadwebkit/533.1;533.1;o" }], ["OPPO_R815T/1.0 Linux/3.4.0 Android/4.2.1  Release/12.24.2012 Browser/AppleWebKit534.30 Mobile Safari/534.30 MBBMS/2.2 System/Android 4.2.1;", {
	  device: "oppo/r815t",
	  os: "android/4.2.1",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["KONKA-V926/1.0 Linux/2.6.35.7 Android/2.3.5 Release/07.30.2012 Browser/AppleWebKit533.1 (KHTML%2C like Gecko) Mozilla/5.0 Mobile", {
	  device: "konka/v926",
	  os: "android/2.3.5",
	  browser: "na/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }],
	
	// UC
	["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-CN; MI 1SC Build/IMM76D) AppleWebKit/534.31 (KHTML, like Gecko) UCBrowser/8.8.2.274 U3/0.8.0 Mobile Safari/534.31", {
	  device: "mi/1sc",
	  os: "android/4.0.4",
	  browser: "uc/8.8.2.274;8.8.2.274;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["UCWEB/2.0 (Linux; U; Adr 2.3.5; zh-CN; F-03D) U2/1.0.0 UCBrowser/8.8.3.278 U2/1.0.0 Mobile", {
	  device: "android/-1",
	  os: "android/2.3.5",
	  browser: "uc/8.8.3.278;8.8.3.278;o",
	  engine: "u2/1.0.0;1.0.0;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.5; zh-cn; MI-ONE Plus Build/GINGERBREAD) UC AppleWebKit/530+ (KHTML%2C like Gecko) Mobile Safari/530", {
	  device: "mi/one plus",
	  os: "android/2.3.5",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/530+;530+;o" }],
	// SAMSUNG Android Pad, UC HD.
	["Mozilla/5.0 (Linux; U; Android 3.2; zh-cn; GT-P6800 Build/HTJ85B) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13 UCBrowser/2.3.2.289", {
	  device: "samsung/p6800",
	  os: "android/3.2",
	  browser: "uc/2.3.2.289;2.3.2.289;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.13;534.13;o" }], ["Mozilla/5.0 (Linux; U; Android 4.0.4; zh-cn; SAMSUNG-GT-S7568_TD/1.0 Android/4.0.4 Release/07.15.2012 Browser/AppleWebKit534.30 Build/IMM76D) ApplelWebkit/534.30 (KHTML%2Clike Gecko) Version/4.0 Mobile Safari/534.30", {
	  device: "samsung/s7568",
	  os: "android/4.0.4",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; SCH-I779 Build/GINGERBREAD) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "samsung/i779",
	  os: "android/2.3.6",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], [{
	  "userAgent": "Mozilla/5.0 (Linux; U; Android 3.2; zh-cn; GT-P6800 Build/HTJ85B) UC AppleWebKit/534.31 (KHTML, like Gecko) Mobile Safari/534.31",
	  "appVersion": "5.0 (Linux; U; Android 3.2; zh-cn; GT-P6800 Build/HTJ85B) UC AppleWebKit/534.31 (KHTML, like Gecko) Mobile Safari/534.31 UC/8.7.4.225",
	  "vendor": "UCWEB" }, {
	  device: "samsung/p6800",
	  os: "android/3.2",
	  browser: "uc/8.7.4.225;8.7.4.225;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], ["Mozilla/5.0 (Linux; U; Android 4.2.2; zh-cn; SM-T311 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30", {
	  device: "samsung/t311",
	  os: "android/4.2.2",
	  browser: "android/4.0;4.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Mozilla/5.0 (Linux; Android 4.4.2; zh-cn; SAMSUNG-SM-N9009 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36", {
	  device: "samsung/n9009",
	  os: "android/4.4.2",
	  browser: "chrome/28.0.1500.94;28.0.1500.94;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }], ["(Linux; Android 4.3; zh-cn; SAMSUNG SM-N9002 Build/JSS15J) AppleWebKit/537.36 (KHTML, like Gecko) Version/1.5 Chrome/28.0.1500.94 Mobile Safari/537.36", {
	  device: "samsung/n9002",
	  os: "android/4.3",
	  browser: "chrome/28.0.1500.94;28.0.1500.94;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }], ["Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; LG-P500 Build/GRI40) UC AppleWebKit/534.31 (KHTML%2C like Gecko) Mobile Safari/534.31", {
	  device: "lg/p500",
	  os: "android/2.3.7",
	  browser: "uc/-1;-1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.31;534.31;o" }], [{
	  "userAgent": "Mozilla/4.0 (compatible;Android;320x480)",
	  "appVersion": "4.0 (compatible;Android;320x480) UC/9.1.1.309",
	  "vendor": "UCWEB" }, {
	  device: "android/-1",
	  os: "android/-1",
	  browser: "uc/9.1.1.309;9.1.1.309;o",
	  engine: "na/-1;-1;o" }], [{
	  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12597 Safari/537.36",
	  "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12597 Safari/537.36",
	  "vendor": "Yandex" }, {
	  device: "mac/-1",
	  os: "macosx/10.9.2",
	  browser: "yandex/14.2.1700.12597;14.2.1700.12597;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }], [{
	  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) YaBrowser/14.2.1700.0 Mobile/11D167 Safari/9537.53",
	  "appVersion": "5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) YaBrowser/14.2.1700.0 Mobile/11D167 Safari/9537.53",
	  "vendor": "Apple Computer, Inc." }, {
	  device: "iphone/-1",
	  os: "ios/7.1",
	  browser: "yandex/14.2.1700.0;14.2.1700.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.1;537.51.1;o" }], [{
	  "userAgent": "Mozilla/5.0 (Linux; Android 4.1.1; MI 2 Build/JRO03L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.00 Mobile Safari/537.36",
	  "appVersion": "5.0 (Linux; Android 4.1.1; MI 2 Build/JRO03L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.00 Mobile Safari/537.36",
	  "vendor": "Yandex" }, {
	  device: "mi/2",
	  os: "android/4.1.1",
	  browser: "yandex/14.2.1700.12535.00;14.2.1700.12535.00;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }], [{
	  "userAgent": "Mozilla/5.0 (Linux; Android 4.2.2; MediaPad X1 7.0 Build/HuaweiMediaPad) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.01 Safari/537.36",
	  "appVersion": "5.0 (Linux; Android 4.2.2; MediaPad X1 7.0 Build/HuaweiMediaPad) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.102 YaBrowser/14.2.1700.12535.01 Safari/537.36",
	  "vendor": "Yandex" }, {
	  device: "huawei/x1 7.0",
	  os: "android/4.2.2",
	  browser: "yandex/14.2.1700.12535.01;14.2.1700.12535.01;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }], [{
	  "userAgent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1106.241 YaBrowser/1.5.1106.241 Safari/537.4",
	  "appVersion": "5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1106.241 YaBrowser/1.5.1106.241 Safari/537.4",
	  "vendor": "Yandex" }, {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "yandex/1.5.1106.241;1.5.1106.241;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.4;537.4;o" }], ["Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 AliApp(AP/2.3.4) AlipayClient/2.3.4", {
	  device: "iphone/-1",
	  os: "ios/7.0",
	  browser: "ali-ap/2.3.4;2.3.4;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.1;537.51.1;o" }], ["Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML,  like Gecko) Mobile/11D201 AlipayClient/8.0.0.0110", {
	  device: "iphone/-1",
	  os: "ios/7.1.1",
	  browser: "ali-ap/8.0.0.0110;8.0.0.0110;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.2;537.51.2;o" }],
	
	//安卓opera
	["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; MI 3W Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Oupeng/10.0.1.82018 Mobile Safari/537.36", {
	  device: "mi/3w",
	  os: "android/4.4.2",
	  browser: "oupeng/10.0.1.82018;10.0.1.82018;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }],
	//安卓搜狗
	["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; MI 3W Build/KVT49L) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 SogouMSE,SogouMobileBrowser/3.1.2", {
	  device: "mi/3w",
	  os: "android/4.4.2",
	  browser: "sogou/3.1.2;3.1.2;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }],
	//安卓猎豹极速
	["Mozilla/5.0 (Linux; Android 4.4.2; MI 3W) AppleWebKit/535.19 (KHTML, like Gecko) Version/4.0 LieBaoFast/2.10.0 Mobile Safari/535.19", {
	  device: "mi/3w",
	  os: "android/4.4.2",
	  browser: "liebao/2.10.0;2.10.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/535.19;535.19;o" }],
	//百度安卓
	["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; MI 3W Build/KVT49L) AppleWebKit/534.24 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.24 T5/2.0 baidubrowser/5.2.3.0 (Baidu; P1 4.4.2)", {
	  device: "mi/3w",
	  os: "android/4.4.2",
	  browser: "baidu/5.2.3.0;5.2.3.0;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.24;534.24;o" }],
	//小米3 遨游
	["Mozilla/5.0 (iPad; CPU OS 7_1_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D201 Safari/9537.53 MxBrowser/4.3.1.2000", {
	  device: "ipad/-1",
	  os: "ios/7.1.1",
	  browser: "maxthon/4.3.1.2000;4.3.1.2000;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.51.2;537.51.2;o" }],
	// UC桌面浏览器
	["Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 UBrowser/2.0.1288.1 Safari/537.36", {
	  device: "pc/-1",
	  os: "windows/6.1",
	  browser: "uc/2.0.1288.1;2.0.1288.1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.36;537.36;o" }], ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-CN; MI 3W Build/KVT49L) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 UCBrowser/9.9.2.467 U3/0.8.0 Mobile Safari/533.1", {
	  device: "mi/3w",
	  os: "android/4.4.2",
	  browser: "uc/9.9.2.467;9.9.2.467;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["Mozilla/5.0 (iPad; CPU OS 7_1_2 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) BaiduHD/2.6.2 Mobile/10A406 Safari/8536.25", {
	  device: "ipad/-1",
	  os: "ios/7.1.2",
	  browser: "baidu/2.6.2;2.6.2;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.46;534.46;o" }],
	
	// Blackberry
	["Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.1.0.4633 Mobile Safari/537.10+", {
	  device: "blackberry/-1",
	  os: "blackberry/10.1.0.4633",
	  browser: "blackberry/10.1.0.4633;10.1.0.4633;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.10+;537.10+;o" }], ["Mozilla/5.0 (BlackBerry; U; BlackBerry 9810; en-US) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.912 Mobile Safari/534.11+", {
	  device: "blackberry/9810",
	  os: "blackberry/7.1.0.912",
	  browser: "blackberry/7.1.0.912;7.1.0.912;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.11+;534.11+;o" }], ["BlackBerry9000/5.0.0.93 Profile/MIDP-2.0 Configuration/CLDC-1.1 VendorID/179", {
	  device: "blackberry/9000",
	  os: "blackberry/5.0.0.93",
	  browser: "blackberry/5.0.0.93;5.0.0.93;o",
	  engine: "na/-1;-1;o" }],
	
	// iPhone 5, 微信。
	["Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.40 (KHTML, like Gecko) Mobile/11A4372q MicroMessenger/4.5", {
	  device: "iphone/-1",
	  os: "ios/7.0",
	  browser: "micromessenger/4.5;4.5;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/537.40;537.40;o" }],
	// 魅族
	["Mozilla/5.0 (Linux; U; Android 4.0.3; zh-cn; M030 Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 MicroMessenger/4.2.191", {
	  device: "meizu/030",
	  os: "android/4.0.3",
	  browser: "micromessenger/4.2.191;4.2.191;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/534.30;534.30;o" }], ["Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12B435 MicroMessenger/6.0.1 NetType/WIFI", {
	  device: "iphone/-1",
	  os: "ios/8.1.1",
	  browser: "micromessenger/6.0.1;6.0.1;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/600.1.4;600.1.4;o" }], ["Mozilla/5.0 (Linux; U; Android 4.4.4; zh-cn; M463C Build/KTU84P) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025440 Mobile Safari/533.1 MicroMessenger/6.2.5.50_r0e62591.621 NetType/WIFI Language/zh_CN", {
	  device: "meizu/463c",
	  os: "android/4.4.4",
	  browser: "micromessenger/6.2.5.50;6.2.5.50;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }], ["Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; HUAWEI MT7-CL00 Build/HuaweiMT7-CL00) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025440 Mobile Safari/533.1 MicroMessenger/6.2.5.51_rfe7d7c5.621 NetType/WIFI Language/zh_CN", {
	  device: "huawei/mt7",
	  os: "android/4.4.2",
	  browser: "micromessenger/6.2.5.51;6.2.5.51;o",
	  engine: (isBlinkEngine() ? "blink" : "webkit") + "/533.1;533.1;o" }],
	
	// NA
	["", {
	  device: "na/-1",
	  os: "na/-1",
	  browser: "na/-1;-1;o",
	  engine: "na/-1;-1;o" }]];
	
	describe("detector", function () {
	  function makeTest(ua, detect, info, k, origin_ua) {
	    it("ua: " + origin_ua + " » detector " + k + ": " + info[k], function () {
	
	      var ext = "";
	      if (k === "browser" || k === "engine") {
	        ext = ";" + detect[k].fullMode + ";" + (detect[k].compatible ? "c" : "o");
	      }
	
	      expect(detect[k].name + "/" + detect[k].fullVersion + ext).to.equal(info[k]);
	    });
	  }
	
	  var nav = undefined,
	      ua = undefined,
	      info = undefined,
	      detect = undefined,
	      type = undefined;
	  var origin_ua = undefined;
	  for (var i = 0, l = UAs.length; i < l; i++) {
	    nav = UAs[i][0];
	    type = Object.prototype.toString.call(nav);
	    if (type === "[object String]") {
	      ua = nav;
	      origin_ua = ua;
	    } else if (type === "[object Object]") {
	      ua = (nav.userAgent || "") + " " + (nav.appVersion || "") + " " + (nav.vendor || "");
	      origin_ua = nav.userAgent;
	    } else {
	      continue;
	    }
	    info = UAs[i][1];
	    detect = detector.parse(ua);
	    for (var k in info) {
	      if (!info.hasOwnProperty(k)) {
	        continue;
	      }
	      makeTest(ua, detect, info, k, origin_ua);
	    }
	  }
	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	  };
	})();
	
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	
	var NA_VERSION = "-1";
	var NA = {
	  name: "na",
	  version: NA_VERSION
	};
	
	function typeOf(type) {
	  return function (object) {
	    return Object.prototype.toString.call(object) === "[object " + type + "]";
	  };
	}
	var isString = typeOf("String");
	var isRegExp = typeOf("RegExp");
	var isObject = typeOf("Object");
	var isFunction = typeOf("Function");
	
	function each(object, factory) {
	  for (var i = 0, l = object.length; i < l; i++) {
	    if (factory.call(object, object[i], i) === false) {
	      break;
	    }
	  }
	}
	
	// UserAgent Detector.
	// @param {String} ua, userAgent.
	// @param {Object} expression
	// @return {Object}
	//    返回 null 表示当前表达式未匹配成功。
	function detect(name, expression, ua) {
	  var expr = isFunction(expression) ? expression.call(null, ua) : expression;
	  if (!expr) {
	    return null;
	  }
	  var info = {
	    name: name,
	    version: NA_VERSION,
	    codename: ""
	  };
	  if (expr === true) {
	    return info;
	  } else if (isString(expr)) {
	    if (ua.indexOf(expr) !== -1) {
	      return info;
	    }
	  } else if (isObject(expr)) {
	    if (expr.hasOwnProperty("version")) {
	      info.version = expr.version;
	    }
	    return info;
	  } else if (isRegExp(expr)) {
	    var m = expr.exec(ua);
	    if (m) {
	      if (m.length >= 2 && m[1]) {
	        info.version = m[1].replace(/_/g, ".");
	      } else {
	        info.version = NA_VERSION;
	      }
	      return info;
	    }
	  }
	}
	
	// 初始化识别。
	function init(ua, patterns, factory, detector) {
	  var detected = NA;
	  each(patterns, function (pattern) {
	    var d = detect(pattern[0], pattern[1], ua);
	    if (d) {
	      detected = d;
	      return false;
	    }
	  });
	  factory.call(detector, detected.name, detected.version);
	}
	
	var Detector = (function () {
	  function Detector(rules) {
	    _classCallCheck(this, Detector);
	
	    this._rules = rules;
	  }
	
	  // 解析 UserAgent 字符串
	  // @param {String} ua, userAgent string.
	  // @return {Object}
	
	  _createClass(Detector, [{
	    key: "parse",
	    value: function parse(ua) {
	      ua = (ua || "").toLowerCase();
	      var d = {};
	
	      init(ua, this._rules.device, function (name, version) {
	        var v = parseFloat(version);
	        d.device = {
	          name: name,
	          version: v,
	          fullVersion: version
	        };
	        d.device[name] = v;
	      }, d);
	
	      init(ua, this._rules.os, function (name, version) {
	        var v = parseFloat(version);
	        d.os = {
	          name: name,
	          version: v,
	          fullVersion: version
	        };
	        d.os[name] = v;
	      }, d);
	
	      var ieCore = this.IEMode(ua);
	
	      init(ua, this._rules.engine, function (name, version) {
	        var mode = version;
	        // IE 内核的浏览器，修复版本号及兼容模式。
	        if (ieCore) {
	          version = ieCore.engineVersion || ieCore.engineMode;
	          mode = ieCore.engineMode;
	        }
	        var v = parseFloat(version);
	        d.engine = {
	          name: name,
	          version: v,
	          fullVersion: version,
	          mode: parseFloat(mode),
	          fullMode: mode,
	          compatible: ieCore ? ieCore.compatible : false
	        };
	        d.engine[name] = v;
	      }, d);
	
	      init(ua, this._rules.browser, function (name, version) {
	        var mode = version;
	        // IE 内核的浏览器，修复浏览器版本及兼容模式。
	        if (ieCore) {
	          // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
	          if (name === "ie") {
	            version = ieCore.browserVersion;
	          }
	          mode = ieCore.browserMode;
	        }
	        var v = parseFloat(version);
	        d.browser = {
	          name: name,
	          version: v,
	          fullVersion: version,
	          mode: parseFloat(mode),
	          fullMode: mode,
	          compatible: ieCore ? ieCore.compatible : false
	        };
	        d.browser[name] = v;
	      }, d);
	      return d;
	    }
	
	    // 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
	    // @param {String} ua, userAgent string.
	    // @return {Object}
	
	  }, {
	    key: "IEMode",
	    value: function IEMode(ua) {
	      if (!this._rules.re_msie.test(ua)) {
	        return null;
	      }
	
	      var m = void 0;
	      var engineMode = void 0;
	      var engineVersion = void 0;
	      var browserMode = void 0;
	      var browserVersion = void 0;
	
	      // IE8 及其以上提供有 Trident 信息，
	      // 默认的兼容模式，UA 中 Trident 版本不发生变化。
	      if (ua.indexOf("trident/") !== -1) {
	        m = /\btrident\/([0-9.]+)/.exec(ua);
	        if (m && m.length >= 2) {
	          // 真实引擎版本。
	          engineVersion = m[1];
	          var v_version = m[1].split(".");
	          v_version[0] = parseInt(v_version[0], 10) + 4;
	          browserVersion = v_version.join(".");
	        }
	      }
	
	      m = this._rules.re_msie.exec(ua);
	      browserMode = m[1];
	      var v_mode = m[1].split(".");
	      if (typeof browserVersion === "undefined") {
	        browserVersion = browserMode;
	      }
	      v_mode[0] = parseInt(v_mode[0], 10) - 4;
	      engineMode = v_mode.join(".");
	      if (typeof engineVersion === "undefined") {
	        engineVersion = engineMode;
	      }
	
	      return {
	        browserVersion: browserVersion,
	        browserMode: browserMode,
	        engineVersion: engineVersion,
	        engineMode: engineMode,
	        compatible: engineVersion !== engineMode
	      };
	    }
	  }]);
	
	  return Detector;
	})();
	
	module.exports = Detector;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Detector = __webpack_require__(4);
	var WebRules = __webpack_require__(6);
	
	var userAgent = navigator.userAgent || "";
	//const platform = navigator.platform || "";
	var appVersion = navigator.appVersion || "";
	var vendor = navigator.vendor || "";
	var ua = userAgent + " " + appVersion + " " + vendor;
	
	var detector = new Detector(WebRules);
	
	// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
	// @param {String} ua, userAgent string.
	// @return {Object}
	function IEMode(ua) {
	  if (!WebRules.re_msie.test(ua)) {
	    return null;
	  }
	
	  var m = void 0;
	  var engineMode = void 0;
	  var engineVersion = void 0;
	  var browserMode = void 0;
	  var browserVersion = void 0;
	
	  // IE8 及其以上提供有 Trident 信息，
	  // 默认的兼容模式，UA 中 Trident 版本不发生变化。
	  if (ua.indexOf("trident/") !== -1) {
	    m = /\btrident\/([0-9.]+)/.exec(ua);
	    if (m && m.length >= 2) {
	      // 真实引擎版本。
	      engineVersion = m[1];
	      var v_version = m[1].split(".");
	      v_version[0] = parseInt(v_version[0], 10) + 4;
	      browserVersion = v_version.join(".");
	    }
	  }
	
	  m = WebRules.re_msie.exec(ua);
	  browserMode = m[1];
	  var v_mode = m[1].split(".");
	  if (typeof browserVersion === "undefined") {
	    browserVersion = browserMode;
	  }
	  v_mode[0] = parseInt(v_mode[0], 10) - 4;
	  engineMode = v_mode.join(".");
	  if (typeof engineVersion === "undefined") {
	    engineVersion = engineMode;
	  }
	
	  return {
	    browserVersion: browserVersion,
	    browserMode: browserMode,
	    engineVersion: engineVersion,
	    engineMode: engineMode,
	    compatible: engineVersion !== engineMode
	  };
	}
	
	function WebParse(ua) {
	  var d = detector.parse(ua);
	
	  var ieCore = IEMode(ua);
	
	  // IE 内核的浏览器，修复版本号及兼容模式。
	  if (ieCore) {
	    var engineName = d.engine.name;
	    var engineVersion = ieCore.engineVersion || ieCore.engineMode;
	    var ve = parseFloat(engineVersion);
	    var engineMode = ieCore.engineMode;
	
	    d.engine = {
	      name: engineName,
	      version: ve,
	      fullVersion: engineVersion,
	      mode: parseFloat(engineMode),
	      fullMode: engineMode,
	      compatible: ieCore ? ieCore.compatible : false
	    };
	    d.engine[d.engine.name] = ve;
	
	    var browserName = d.browser.name;
	    // IE 内核的浏览器，修复浏览器版本及兼容模式。
	    // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
	    var browserVersion = d.browser.fullVersion;
	    if (browserName === "ie") {
	      browserVersion = ieCore.browserVersion;
	    }
	    var browserMode = ieCore.browserMode;
	    var vb = parseFloat(browserVersion);
	    d.browser = {
	      name: browserName,
	      version: vb,
	      fullVersion: browserVersion,
	      mode: parseFloat(browserMode),
	      fullMode: browserMode,
	      compatible: ieCore ? ieCore.compatible : false
	    };
	    d.browser[browserName] = vb;
	  }
	  return d;
	}
	
	var Tan = WebParse(ua);
	Tan.parse = WebParse;
	module.exports = Tan;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	var win = typeof window === "undefined" ? global : window;
	var external = win.external;
	var re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;
	var re_blackberry_10 = /\bbb10\b.+?\bversion\/([\d.]+)/;
	var re_blackberry_6_7 = /\bblackberry\b.+\bversion\/([\d.]+)/;
	var re_blackberry_4_5 = /\bblackberry\d+\/([\d.]+)/;
	
	var NA_VERSION = "-1";
	
	// 硬件设备信息识别表达式。
	// 使用数组可以按优先级排序。
	var DEVICES = [["nokia", function (ua) {
	  // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
	  // 这种情况下会优先识别出 nokia/-1
	  if (ua.indexOf("nokia ") !== -1) {
	    return /\bnokia ([0-9]+)?/;
	  } else {
	    return /\bnokia([a-z0-9]+)?/;
	  }
	}],
	// 三星有 Android 和 WP 设备。
	["samsung", function (ua) {
	  if (ua.indexOf("samsung") !== -1) {
	    return /\bsamsung(?:[ \-](?:sgh|gt|sm))?-([a-z0-9]+)/;
	  } else {
	    return /\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/;
	  }
	}], ["wp", function (ua) {
	  return ua.indexOf("windows phone ") !== -1 || ua.indexOf("xblwp") !== -1 || ua.indexOf("zunewp") !== -1 || ua.indexOf("windows ce") !== -1;
	}], ["pc", "windows"], ["ipad", "ipad"],
	// ipod 规则应置于 iphone 之前。
	["ipod", "ipod"], ["iphone", /\biphone\b|\biph(\d)/], ["mac", "macintosh"],
	// 小米
	["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/],
	// 红米
	["hongmi", /\bhm[ \-]?([a-z0-9]+)/], ["aliyun", /\baliyunos\b(?:[\-](\d+))?/], ["meizu", function (ua) {
	  return ua.indexOf("meizu") >= 0 ? /\bmeizu[\/ ]([a-z0-9]+)\b/ : /\bm([0-9cx]{1,4})\b/;
	}], ["nexus", /\bnexus ([0-9s.]+)/], ["huawei", function (ua) {
	  var re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
	  if (ua.indexOf("huawei-huawei") !== -1) {
	    return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
	  } else if (re_mediapad.test(ua)) {
	    return re_mediapad;
	  } else {
	    return /\bhuawei[ _\-]?([a-z0-9]+)/;
	  }
	}], ["lenovo", function (ua) {
	  if (ua.indexOf("lenovo-lenovo") !== -1) {
	    return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
	  } else {
	    return /\blenovo[ \-]?([a-z0-9]+)/;
	  }
	}],
	// 中兴
	["zte", function (ua) {
	  if (/\bzte\-[tu]/.test(ua)) {
	    return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
	  } else {
	    return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
	  }
	}],
	// 步步高
	["vivo", /\bvivo(?: ([a-z0-9]+))?/], ["htc", function (ua) {
	  if (/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)) {
	    return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/;
	  } else {
	    return /\bhtc[ _\-]?([a-z0-9 ]+)/;
	  }
	}], ["oppo", /\boppo[_]([a-z0-9]+)/], ["konka", /\bkonka[_\-]([a-z0-9]+)/], ["sonyericsson", /\bmt([a-z0-9]+)/], ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/], ["lg", /\blg[\-]([a-z0-9]+)/], ["android", /\bandroid\b|\badr\b/], ["blackberry", function (ua) {
	  if (ua.indexOf("blackberry") >= 0) {
	    return /\bblackberry\s?(\d+)/;
	  }
	  return "bb10";
	}]];
	
	// 操作系统信息识别表达式
	var OS = [["wp", function (ua) {
	  if (ua.indexOf("windows phone ") !== -1) {
	    return /\bwindows phone (?:os )?([0-9.]+)/;
	  } else if (ua.indexOf("xblwp") !== -1) {
	    return /\bxblwp([0-9.]+)/;
	  } else if (ua.indexOf("zunewp") !== -1) {
	    return /\bzunewp([0-9.]+)/;
	  }
	  return "windows phone";
	}], ["windows", /\bwindows nt ([0-9.]+)/], ["macosx", /\bmac os x ([0-9._]+)/], ["ios", function (ua) {
	  if (/\bcpu(?: iphone)? os /.test(ua)) {
	    return /\bcpu(?: iphone)? os ([0-9._]+)/;
	  } else if (ua.indexOf("iph os ") !== -1) {
	    return /\biph os ([0-9_]+)/;
	  } else {
	    return /\bios\b/;
	  }
	}], ["yunos", /\baliyunos ([0-9.]+)/], ["android", function (ua) {
	  if (ua.indexOf("android") >= 0) {
	    return /\bandroid[ \/-]?([0-9.x]+)?/;
	  } else if (ua.indexOf("adr") >= 0) {
	    if (ua.indexOf("mqqbrowser") >= 0) {
	      return /\badr[ ]\(linux; u; ([0-9.]+)?/;
	    } else {
	      return /\badr(?:[ ]([0-9.]+))?/;
	    }
	  }
	  return "android";
	  //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
	}], ["chromeos", /\bcros i686 ([0-9.]+)/], ["linux", "linux"], ["windowsce", /\bwindows ce(?: ([0-9.]+))?/], ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/], ["blackberry", function (ua) {
	  var m = ua.match(re_blackberry_10) || ua.match(re_blackberry_6_7) || ua.match(re_blackberry_4_5);
	  return m ? { version: m[1] } : "blackberry";
	}]];
	
	// 针对同源的 TheWorld 和 360 的 external 对象进行检测。
	// @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
	// @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
	function checkTW360External(key) {
	  if (!external) {
	    return;
	  } // return undefined.
	  try {
	    //        360安装路径：
	    //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
	    var runpath = external.twGetRunPath.toLowerCase();
	    // 360SE 3.x ~ 5.x support.
	    // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
	    // 因此只能用 try/catch 而无法使用特性判断。
	    var security = external.twGetSecurityID(win);
	    var version = external.twGetVersion(security);
	
	    if (runpath && runpath.indexOf(key) === -1) {
	      return false;
	    }
	    if (version) {
	      return { version: version };
	    }
	  } catch (ex) {}
	}
	
	var ENGINE = [["edgehtml", /edge\/([0-9.]+)/], ["trident", re_msie], ["blink", function () {
	  return "chrome" in win && "CSS" in win && /\bapplewebkit[\/]?([0-9.+]+)/;
	}], ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/], ["gecko", function (ua) {
	  var match = ua.match(/\brv:([\d\w.]+).*\bgecko\/(\d+)/);
	  if (match) {
	    return {
	      version: match[1] + "." + match[2]
	    };
	  }
	}], ["presto", /\bpresto\/([0-9.]+)/], ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/], ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/], ["u2", /\bu2\/([0-9.]+)/], ["u3", /\bu3\/([0-9.]+)/]];
	var BROWSER = [
	// Microsoft Edge Browser, Default browser in Windows 10.
	["edge", /edge\/([0-9.]+)/],
	// Sogou.
	["sogou", function (ua) {
	  if (ua.indexOf("sogoumobilebrowser") >= 0) {
	    return /sogoumobilebrowser\/([0-9.]+)/;
	  } else if (ua.indexOf("sogoumse") >= 0) {
	    return true;
	  }
	  return / se ([0-9.x]+)/;
	}],
	// TheWorld (世界之窗)
	// 由于裙带关系，TheWorld API 与 360 高度重合。
	// 只能通过 UA 和程序安装路径中的应用程序名来区分。
	// TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
	["theworld", function () {
	  var x = checkTW360External("theworld");
	  if (typeof x !== "undefined") {
	    return x;
	  }
	  return /theworld(?: ([\d.])+)?/;
	}],
	// 360SE, 360EE.
	["360", function (ua) {
	  var x = checkTW360External("360se");
	  if (typeof x !== "undefined") {
	    return x;
	  }
	  if (ua.indexOf("360 aphone browser") !== -1) {
	    return /\b360 aphone browser \(([^\)]+)\)/;
	  }
	  return /\b360(?:se|ee|chrome|browser)\b/;
	}],
	// Maxthon
	["maxthon", function () {
	  try {
	    if (external && (external.mxVersion || external.max_version)) {
	      return {
	        version: external.mxVersion || external.max_version
	      };
	    }
	  } catch (ex) {}
	  return /\b(?:maxthon|mxbrowser)(?:[ \/]([0-9.]+))?/;
	}], ["micromessenger", /\bmicromessenger\/([\d.]+)/], ["qq", /\bm?qqbrowser\/([0-9.]+)/], ["green", "greenbrowser"], ["tt", /\btencenttraveler ([0-9.]+)/], ["liebao", function (ua) {
	  if (ua.indexOf("liebaofast") >= 0) {
	    return /\bliebaofast\/([0-9.]+)/;
	  }
	  if (ua.indexOf("lbbrowser") === -1) {
	    return false;
	  }
	  var version = void 0;
	  try {
	    if (external && external.LiebaoGetVersion) {
	      version = external.LiebaoGetVersion();
	    }
	  } catch (ex) {}
	  return {
	    version: version || NA_VERSION
	  };
	}], ["tao", /\btaobrowser\/([0-9.]+)/], ["coolnovo", /\bcoolnovo\/([0-9.]+)/], ["saayaa", "saayaa"],
	// 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
	["baidu", /\b(?:ba?idubrowser|baiduhd)[ \/]([0-9.x]+)/],
	// 后面会做修复版本号，这里只要能识别是 IE 即可。
	["ie", re_msie], ["mi", /\bmiuibrowser\/([0-9.]+)/],
	// Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
	["opera", function (ua) {
	  var re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
	  var re_opera_new = /\bopr\/([0-9.]+)/;
	  return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
	}], ["oupeng", /\boupeng\/([0-9.]+)/], ["yandex", /yabrowser\/([0-9.]+)/],
	// 支付宝手机客户端
	["ali-ap", function (ua) {
	  if (ua.indexOf("aliapp") > 0) {
	    return /\baliapp\(ap\/([0-9.]+)\)/;
	  } else {
	    return /\balipayclient\/([0-9.]+)\b/;
	  }
	}],
	// 支付宝平板客户端
	["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
	// 支付宝商户客户端
	["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
	// 淘宝手机客户端
	["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
	// 淘宝平板客户端
	["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
	// 天猫手机客户端
	["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
	// 天猫平板客户端
	["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
	// UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
	// UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
	["uc", function (ua) {
	  if (ua.indexOf("ucbrowser/") >= 0) {
	    return /\bucbrowser\/([0-9.]+)/;
	  } else if (ua.indexOf("ubrowser/") >= 0) {
	    return /\bubrowser\/([0-9.]+)/;
	  } else if (/\buc\/[0-9]/.test(ua)) {
	    return /\buc\/([0-9.]+)/;
	  } else if (ua.indexOf("ucweb") >= 0) {
	    // `ucweb/2.0` is compony info.
	    // `UCWEB8.7.2.214/145/800` is browser info.
	    return /\bucweb([0-9.]+)?/;
	  } else {
	    return /\b(?:ucbrowser|uc)\b/;
	  }
	}], ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
	// Android 默认浏览器。该规则需要在 safari 之前。
	["android", function (ua) {
	  if (ua.indexOf("android") === -1) {
	    return;
	  }
	  return /\bversion\/([0-9.]+(?: beta)?)/;
	}], ["blackberry", function (ua) {
	  var m = ua.match(re_blackberry_10) || ua.match(re_blackberry_6_7) || ua.match(re_blackberry_4_5);
	  return m ? { version: m[1] } : "blackberry";
	}], ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
	// 如果不能被识别为 Safari，则猜测是 WebView。
	["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/], ["firefox", /\bfirefox\/([0-9.ab]+)/], ["nokia", /\bnokiabrowser\/([0-9.]+)/]];
	
	module.exports = {
	  device: DEVICES,
	  os: OS,
	  browser: BROWSER,
	  engine: ENGINE,
	  re_msie: re_msie
	};
	/* */ /* */ /* */
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	
		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);
	
		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}
	
		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;
	
			var L = 0;
	
			function push(v) {
				arr[L++] = v;
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 16711680) >> 16);
				push((tmp & 65280) >> 8);
				push(tmp & 255);
			}
	
			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 255);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 255);
				push(tmp & 255);
			}
	
			return arr;
		}
	
		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = '',
			    temp,
			    length;
	
			function encode(num) {
				return lookup.charAt(num);
			}
	
			function tripletToBase64(num) {
				return encode(num >> 18 & 63) + encode(num >> 12 & 63) + encode(num >> 6 & 63) + encode(num & 63);
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 63);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 63);
					output += encode(temp << 2 & 63);
					output += '=';
					break;
			}
	
			return output;
		}
	
		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})( false ? undefined.base64js = {} : exports);

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? nBytes - 1 : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];
	
	  i += d;
	
	  e = s & (1 << -nBits) - 1;
	  s >>= -nBits;
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & (1 << -nBits) - 1;
	  e >>= -nBits;
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : (s ? -1 : 1) * Infinity;
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
	};
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
	  var i = isLE ? 0 : nBytes - 1;
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
	
	  value = Math.abs(value);
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {}
	
	  e = e << mLen | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */
	
	'use strict';
	
	var isArray = Array.isArray;
	
	/**
	 * toString
	 */
	
	var str = Object.prototype.toString;
	
	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */
	
	module.exports = isArray || function (val) {
	  return !!val && '[object Array]' == str.call(val);
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map