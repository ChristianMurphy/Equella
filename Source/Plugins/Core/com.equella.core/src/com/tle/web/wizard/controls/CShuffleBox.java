/*
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * The Apereo Foundation licenses this file to you under the Apache License,
 * Version 2.0, (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.tle.web.wizard.controls;

import com.dytech.edge.wizard.beans.control.WizardControl;
import com.tle.core.wizard.controls.WizardPage;

/**
 * Provides a data model for shuffle box controls.
 *
 * @author Nicholas Read
 */
public class CShuffleBox extends OptionCtrl {
  private static final long serialVersionUID = 1L;

  public CShuffleBox(
      WizardPage page, int controlNumber, int nestingLevel, WizardControl controlBean) {
    super(page, controlNumber, nestingLevel, controlBean);
  }
}
